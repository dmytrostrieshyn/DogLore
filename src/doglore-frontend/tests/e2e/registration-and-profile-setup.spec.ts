import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * End-to-end: register a fresh user, then fully populate the dog profile
 * (edit details, add weight entries, schedule a vaccination reminder).
 *
 * Locator strategy
 * ----------------
 * The product currently exposes no `data-testid` attributes, so this spec
 * relies on the next-most-stable alternatives in order of preference:
 *   1. Input `type` (e.g. `input[type="email"]`, `input[type="date"]`).
 *   2. Unique `placeholder` text (the form copy is in Ukrainian and the
 *      placeholders are unique within a page, so they're stable enough).
 *   3. `getByRole` scoped to a parent container (heading, nav, modal) to
 *      disambiguate buttons whose label repeats (e.g. several "Зберегти").
 *
 * Recommended follow-up: add `data-testid` to these elements so this spec
 * stops depending on copy:
 *   - Auth.jsx — submit button, email/password/dog inputs, register-mode toggle
 *   - DogProfile.jsx — edit/save buttons, weight form, vaccination modal
 */

test.describe('Registration & dog profile setup', () => {
  // Unique data per run — avoids `auth/email-already-in-use` and name collisions.
  const uniqueId = Date.now();
  const TEST_EMAIL = `testuser_${uniqueId}@gmail.com`;
  const TEST_PASSWORD = '123456';
  const DOG_NAME = `TestDog_${uniqueId}`;
  const DOG_AGE_INITIAL = '1';
  const DOG_AGE_UPDATED = '2';
  const DOG_BREED_INITIAL = 'Test';
  const DOG_BREED_UPDATED = `Breed_${uniqueId}`;

  test('signs up a new user and configures the dog profile end-to-end', async ({ page }) => {
    await test.step('Navigate to Auth page', async () => {
      await page.goto('http://localhost:5173/auth');
      await expect(page.getByRole('heading', { name: 'Вхід до акаунту' })).toBeVisible();
    });

    await test.step('Switch to Register mode', async () => {
      // The same "Зареєструватися" text appears twice on the page (navbar + below the form).
      // Scope to the navbar so we don't depend on DOM order.
      await page.locator('nav').getByRole('button', { name: 'Зареєструватися' }).click();
      await expect(page.getByRole('heading', { name: 'Створити акаунт' })).toBeVisible();
    });

    await test.step('Register new account with dog details', async () => {
      await page.locator('input[type="email"]').fill(TEST_EMAIL);
      await page.getByPlaceholder('Мінімум 6 символів').fill(TEST_PASSWORD);
      await page.getByPlaceholder('Наприклад: Рекс').fill(DOG_NAME);
      await page.getByPlaceholder('3').fill(DOG_AGE_INITIAL); // age input (type=number)
      await page.getByPlaceholder('Наприклад: Лабрадор').fill(DOG_BREED_INITIAL);

      await page.getByRole('button', { name: 'Створити акаунт', exact: true }).click();

      // App redirects to /profile once Firebase auth + Firestore writes complete.
      await expect(page).toHaveURL(/\/profile/, { timeout: 15_000 });
      await expect(
        page.getByRole('heading', { name: new RegExp(DOG_NAME, 'i') })
      ).toBeVisible({ timeout: 15_000 });
    });

    await test.step('Enter edit mode on the dog profile', async () => {
      await page.getByRole('button', { name: /Редагувати/ }).click();
      // The breed input only renders while in edit mode — its visibility is our gate.
      await expect(page.getByPlaceholder('Порода')).toBeVisible();
    });

    await test.step('Edit hero-card details (breed, age, gender, height, activity)', async () => {
      await page.getByPlaceholder('Порода').fill(DOG_BREED_UPDATED);
      await page.getByPlaceholder('Вік').fill(DOG_AGE_UPDATED);
      // Two selects render in edit mode: [0] gender, [1] activity level.
      await page.locator('select').nth(0).selectOption('Хлопець');
      await page.getByPlaceholder('см').fill('50');
      await page.locator('select').nth(1).selectOption('Середня');
    });

    await test.step('Edit details card (color, chip, food)', async () => {
      await page.getByPlaceholder('Наприклад: золотий').fill('Test');
      await page.getByPlaceholder('Номер чіпу').fill('67');
      await page.getByPlaceholder('Наприклад: сухий корм').fill('Test');
    });

    await test.step('Add two weight entries', async () => {
      const weightSection = sectionByHeading(page, 'Щоденник росту');

      for (const entry of [
        { weight: '20', label: 'Сер' },
        { weight: '22', label: 'Вер' },
      ]) {
        // Toggle the inline add-weight form (the "+" button next to "Вага").
        await weightSection.getByRole('button', { name: '+', exact: true }).click();

        // Strictly scope to the weight form's own <div>. We require it to
        // contain BOTH unique placeholders ("32.4" weight + "Лип" label) and
        // use .last() so we get the innermost wrapper — not the surrounding
        // card or page wrapper, which would also pull in the hero card's
        // edit-mode "Зберегти" button and trip strict-mode.
        const weightForm = page
          .locator('div')
          .filter({ has: page.getByPlaceholder('32.4') })
          .filter({ has: page.getByPlaceholder('Лип') })
          .last();

        await weightForm.getByPlaceholder('32.4').fill(entry.weight);
        await weightForm.getByPlaceholder('Лип').fill(entry.label);
        await weightForm.getByRole('button', { name: 'Зберегти', exact: true }).click();

        // Form collapses after a successful save.
        await expect(page.getByPlaceholder('32.4')).toHaveCount(0);
        // The new label shows up on the chart.
        await expect(weightSection.getByText(entry.label, { exact: true })).toBeVisible();
      }
    });

    await test.step('Add a vaccination reminder', async () => {
      await page.getByRole('button', { name: /Додати нагадування|Змінити нагадування/ }).click();

      const modal = page.locator('div').filter({
        has: page.getByRole('heading', { name: 'Нагадування про щеплення' }),
      }).last();

      await modal.locator('input[type="date"]').fill('2026-05-26');
      await modal.getByPlaceholder('Наприклад: від сказу').fill('Test');
      await modal.getByRole('button', { name: 'Зберегти', exact: true }).click();

      // Modal closes; the new reminder text appears on the vaccination card.
      await expect(
        page.getByRole('heading', { name: 'Нагадування про щеплення' })
      ).toHaveCount(0);
    });

    await test.step('Save all profile edits and verify persistence', async () => {
      // The hero-card "Зберегти" button is the only one rendered outside any form/modal
      // once the weight form and vaccination modal have closed.
      await page.getByRole('button', { name: 'Зберегти', exact: true }).click();

      // Edit mode exits — the "✎ Редагувати" button reappears.
      await expect(page.getByRole('button', { name: /Редагувати/ })).toBeVisible();

      // Persisted values render in read-only mode.
      await expect(page.getByText(DOG_BREED_UPDATED)).toBeVisible();
      await expect(page.getByText(`${DOG_AGE_UPDATED} р.`)).toBeVisible();
      await expect(page.getByText('Хлопець', { exact: false })).toBeVisible();
      await expect(page.getByText('50 см')).toBeVisible();
      await expect(page.getByText('Середня', { exact: false })).toBeVisible();
      await expect(page.getByText('67')).toBeVisible(); // chip number
    });
  });
});

/**
 * Scope subsequent locators to the card whose heading matches `headingText`.
 * Walks up to the nearest "card" container so that role/placeholder lookups
 * inside don't collide with similar elements elsewhere on the page.
 */
function sectionByHeading(page: Page, headingText: string): Locator {
  return page
    .locator('div')
    .filter({ has: page.getByRole('heading', { name: headingText }) })
    .first();
}
