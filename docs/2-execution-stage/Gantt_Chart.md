# Діаграма Ганта (Gantt Chart)

*Графік виконання завдань розподілено по годинах у рамках одноденного спринту.*

```mermaid
gantt
    title Графік розробки проекту DogLore
    dateFormat  YYYY-MM-DD
    axisFormat  %d-%m
    
    section Ініціалізація
    Git та Сет-ап       :done, t1, 2026-05-11, 1d
    Документація        :done, t2, 2026-05-11, 1d
    
    section UI Дизайн
    Figma макети        :done, t3, 2026-05-11, 2d
    UI Верстка          :done, t4, 2026-05-12, 1d
    SVG та Стилі        :active, t5, 2026-05-14, 2d
    
    section Backend
    Firebase БД         :done, t6, 2026-05-12, 1d
    API Шар             :done, t7, 2026-05-12, 2d
    Архітектура         :done, t8, 2026-05-13, 1d
    
    section Інтеграція
    Контент             :done, t9, 2026-05-13, 2d
    Логіка Auth         :done, t10, 2026-05-14, 1d
    Трекінг             :done, t11, 2026-05-14, 1d
    
    section QA
    QA Тести            :active, t12, 2026-05-13, 3d
    UI Фікси            :active, t13, 2026-05-15, 1d
    Деплой              :t14, 2026-05-15, 1d
