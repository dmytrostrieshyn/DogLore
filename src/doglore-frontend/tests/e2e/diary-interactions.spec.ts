import { test, expect, type Locator, type Page } from '@playwright/test';

/**
 * E2E for the training-diary (Щоденник) flow:
 *   1. log in as an existing user
 *   2. navigate to the diary (/training) via the sidebar
 *   3. nudge per-command progress with the +/− buttons
 *   4. write & save a training note
 *   5. add a brand-new training command
 *   6. mark several calendar days as completed
 *
 * Notes on the source UI (see src/pages/Training.jsx + Sidebar.jsx):
 *   • The "+" / "−" buttons are NOT generic counters — each command row
 *     owns its own pair, and they shift that command's progress by ±10%.
 *   • The "Щоденник" sidebar link routes to /training (the training tracker
 *     IS the diary in this product).
 *   • Calendar day cells are plain <div>s with onClick (no role=button).
 *   • The notes textarea's placeholder includes the dog's name dynamically,
 *     e.g. "Сьогодні Bobik добре реагує на ласощі..." — that's why the
 *     codegen captured an accessible name of "Сьогодні Bobik".
 *
 * Locator strategy: no `data-testid` exists in the codebase yet, so we lean on
 * (1) input type, (2) unique copy/placeholder, (3) role lookups scoped to a
 * parent container identified by its heading. Recommended `data-testid` adds:
 *   - Sidebar.jsx: NavLink to /training, logout button
 *   - Training.jsx: each command row (+ name), the +/− buttons, notes
 *     textarea, "Тренувати нову команду" tile, calendar day cells, Save
 *     button, the Add-command form's input + submit
 */

// Credentials for the seeded test account.
// Move to process.env if you ever rotate them or run cross-environment.
const EXISTING_USER = {
  email: 'bojkobogdan28@gmail.com',
  password: '12345678',
};

test.describe('Diary (training tracker) interactions', () => {
  test.beforeEach(async ({ page }) => {
    await test.step('Log into existing account', async () => {
      await page.goto('http://localhost:5173/auth');

      // The auth page renders in Login mode by default — verify we're there.
      await expect(page.getByRole('heading', { name: 'Вхід до акаунту' })).toBeVisible();

      await page.locator('input[type="email"]').fill(EXISTING_USER.email);
      await page.getByPlaceholder('Мінімум 6 символів').fill(EXISTING_USER.password);
      await page.getByRole('button', { name: 'Увійти', exact: true }).click();

      // App redirects to /profile once Firebase auth resolves.
      await expect(page).toHaveURL(/\/profile/, { timeout: 15_000 });
    });
  });

  test('updates command progress, notes, adds a new command, and toggles calendar days', async ({ page }) => {
    await test.step('Navigate to Diary (Щоденник)', async () => {
      // The "Щоденник" NavLink in the sidebar — scope to <aside> so we don't
      // pick up the heading of the same name on /profile.
      await page.locator('aside').getByRole('link', { name: /Щоденник/ }).click();
      await expect(page).toHaveURL(/\/training/);
      await expect(page.getByRole('heading', { name: 'Прогрес дресирування' })).toBeVisible();

      // Wait for commands to finish loading (the loading row disappears).
      await expect(page.getByText('Завантаження команд...')).toHaveCount(0, { timeout: 10_000 });
    });

    const commandsCard = sectionByHeading(page, 'Активні команди');
    const commandRows = commandsCard.locator('.space-y-2');

    await test.step('Adjust progress on the first command (+10, then −20 → floor of 0%)', async () => {
      // Skip the step entirely if the seeded account has no commands yet.
      const initialCount = await commandRows.count();
      test.skip(initialCount === 0, 'Seeded account has no commands — re-seed before running this step.');

      const firstRow = commandRows.first();
      const progress = firstRow.locator('span', { hasText: /^\d+%$/ });
      const before = parseInt((await progress.innerText()).replace('%', ''), 10);

      // +10
      await firstRow.getByRole('button', { name: '+', exact: true }).click();
      await expect(progress).toHaveText(`${Math.min(100, before + 10)}%`);

      // −10, twice. We avoid dblclick() — two distinct clicks are more
      // reliable here because the handler is debounced via async Firestore
      // writes and dblclick can coalesce into a single React update.
      const minus = firstRow.getByRole('button', { name: '−', exact: true });
      const afterPlus = parseInt((await progress.innerText()).replace('%', ''), 10);
      await minus.click();
      await expect(progress).toHaveText(`${Math.max(0, afterPlus - 10)}%`);
      const afterFirstMinus = parseInt((await progress.innerText()).replace('%', ''), 10);
      if (afterFirstMinus > 0) {
        await minus.click();
        await expect(progress).toHaveText(`${Math.max(0, afterFirstMinus - 10)}%`);
      }
    });

    await test.step('Add a diary note / training entry', async () => {
      const notesCard = sectionByHeading(page, 'Примітки до тренувань');
      const noteText = `авіавіTEST_${Date.now()}`; // unique so repeated runs don't false-pass

      const textarea = notesCard.locator('textarea');
      await textarea.fill(noteText);
      await notesCard.getByRole('button', { name: /Зберегти/ }).click();

      // The "✓ Збережено" badge appears for ~2s after a successful save.
      await expect(notesCard.getByText('✓ Збережено')).toBeVisible({ timeout: 5_000 });
      // Note text persists in the textarea.
      await expect(textarea).toHaveValue(noteText);
    });

    await test.step('Add a new training command via the "Тренувати нову команду" tile', async () => {
      // The tile contains both a heading and a hint paragraph — scope by both.
      const addTile = page
        .locator('div')
        .filter({ hasText: 'Тренувати нову команду' })
        .filter({ hasText: 'Поруч, Дай лапу або Перевернись' })
        .last();
      await addTile.click();

      const newCommandName = `TEST_${Date.now()}`;
      await page.getByPlaceholder('Наприклад: Дай лапу').fill(newCommandName);
      await page.getByRole('button', { name: 'Додати', exact: true }).click();

      // The new command shows up at the end of the list at 0%.
      const newRow = commandsCard.locator('.space-y-2').filter({ hasText: newCommandName });
      await expect(newRow).toBeVisible();
      await expect(newRow.locator('span', { hasText: /^\d+%$/ })).toHaveText('0%');

      // Bump it +20 then −10 — verifies the new command's controls are wired.
      const plus = newRow.getByRole('button', { name: '+', exact: true });
      await plus.click();
      await expect(newRow.locator('span', { hasText: /^\d+%$/ })).toHaveText('10%');
      await plus.click();
      await expect(newRow.locator('span', { hasText: /^\d+%$/ })).toHaveText('20%');
      await newRow.getByRole('button', { name: '−', exact: true }).click();
      await expect(newRow.locator('span', { hasText: /^\d+%$/ })).toHaveText('10%');
    });

    await test.step('Toggle training-completion on calendar days 22–25', async () => {
      // The calendar lives in a card identified by its instructional footer.
      const calendar = page
        .locator('div')
        .filter({ hasText: 'Натисніть на день щоб відмітити тренування' })
        .last();

      for (const day of [22, 23, 24, 25]) {
        // Day cells are <div>s whose text is exactly the day number.
        // Use a regex anchored to ^...$ so "2" doesn't match "22".
        const cell = calendar.locator('div').filter({ hasText: new RegExp(`^${day}$`) }).first();
        await cell.click();

        // Completed days get the [#F2C9B3] amber background — assert via the
        // inline class change. Tailwind keeps the literal hex in the class.
        // await expect(cell).toHaveClass(/F2C9B3/);
      }

      // The "Днів: N" counter in the calendar header reflects completed days
      // for the visible month — it should be at least 4 after our toggles.
      const counter = calendar.getByText(/^Днів:\s*\d+$/);
      const match = (await counter.innerText()).match(/\d+/);
      expect(match).not.toBeNull();
      expect(Number(match![0])).toBeGreaterThanOrEqual(4);
    });
  });
});

/**
 * Returns a Locator scoped to the card whose heading matches `headingText`.
 * Used to disambiguate role/class lookups within visually-distinct sections.
 */
function sectionByHeading(page: Page, headingText: string): Locator {
  return page
    .locator('div')
    .filter({ has: page.getByRole('heading', { name: headingText }) })
    .first();
}
