# SearchableSelect Component Usage

The `SearchableSelect` component has been modified to be a reusable, flexible component that can be integrated into various forms and dialogs.

## Features

-   **Searchable dropdown**: Users can type to filter options
-   **Customizable**: Configurable placeholder text, search placeholder, and empty state message
-   **Controlled component**: Supports external state management
-   **Disabled state**: Can be disabled when needed (e.g., during loading)
-   **Flexible styling**: Supports custom CSS classes and width configuration

## Props

```typescript
interface SelectOption {
    value: string;
    label: string;
    id?: number;
}

type SearchableSelectProps = {
    placeholder: string; // Text shown when no value is selected
    searchPlaceholder?: string; // Placeholder for search input (default: "Search...")
    emptyMessage?: string; // Message when no options found (default: "No items found.")
    options: SelectOption[]; // Array of selectable options
    value?: string; // Currently selected value
    onChange?: (value: string) => void; // Callback when value changes
    disabled?: boolean; // Whether the select is disabled (default: false)
    className?: string; // Additional CSS classes
    width?: string; // Width class (default: "w-full")
};
```

## How Search Works

The component now searches by **labels** instead of values, making it much more user-friendly:

```typescript
const sportsOptions = [
    { value: "1", label: "Basketball", id: 1 },
    { value: "2", label: "Football", id: 2 },
    { value: "3", label: "Tennis", id: 3 },
];
```

-   ✅ User types "Basketball" → finds the Basketball option
-   ✅ User types "ball" → finds both Basketball and Football
-   ✅ User types "ten" → finds Tennis
-   ❌ User types "1" → doesn't find Basketball (searches labels, not values)

## Usage Examples

### Basic Usage

```typescript
const options = [
    { value: "1", label: "Basketball", id: 1 },
    { value: "2", label: "Football", id: 2 },
    { value: "3", label: "Tennis", id: 3 },
];

<SearchableSelect
    placeholder="Select a Sport"
    options={options}
    value={selectedValue}
    onChange={setSelectedValue}
/>;
```

### Sports Selection (as used in add-schedule-dialog)

```typescript
const sportsOptions: SelectOption[] = sports.map((sport) => ({
    value: sport.id.toString(),
    label: sport.gameName,
    id: sport.id,
}));

<SearchableSelect
    placeholder="Select a Sport"
    searchPlaceholder="Search sports..."
    emptyMessage="No sports found."
    options={sportsOptions}
    value={selectedSport?.toString() || ""}
    onChange={(value) => setSelectedSport(value ? Number(value) : null)}
    disabled={loading}
/>;
```

### Team Selection

```typescript
const teamOptions: SelectOption[] = sportTeams.map((team) => ({
    value: team.teamId.toString(),
    label: team.team.teamName,
    id: team.teamId,
}));

<SearchableSelect
    placeholder="Select Team"
    searchPlaceholder="Search teams..."
    emptyMessage="No teams found."
    options={teamOptions}
    value={
        scheduleInputs.teamAId !== -1 ? scheduleInputs.teamAId.toString() : ""
    }
    onChange={(value) =>
        setScheduleInputs({
            ...scheduleInputs,
            teamAId: value ? Number(value) : -1,
        })
    }
    disabled={!selectedSport || fetchingTeams}
/>;
```

## Integration in Add Schedule Dialog

The component is now successfully integrated into the `add-schedule-dialog.tsx` for:

1. **Sports Selection**: Allows users to search and select from available sports
2. **Team A Selection**: Allows users to search and select the first team (filtered by selected sport)
3. **Team B Selection**: Allows users to search and select the second team (filtered by selected sport)

## Key Benefits

-   **Better UX**: Users can quickly find options by typing instead of scrolling through long lists
-   **Consistent Interface**: All dropdowns have the same look and behavior
-   **Type Safety**: Full TypeScript support with proper interfaces
-   **Reusable**: Can be easily used in other parts of the application
-   **Accessible**: Built on top of Radix UI components for accessibility

## Data Transformation

The component expects data in the `SelectOption` format. You can easily transform your existing data:

```typescript
// Transform any data structure to SelectOption format
const transformedOptions = yourData.map((item) => ({
    value: item.id.toString(),
    label: item.displayName,
    id: item.id,
}));
```
