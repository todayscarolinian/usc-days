# Standings Module Documentation

## Overview

The Standings module manages championship rankings and team performance statistics for USC Days intramural sports. It displays the top 3 champions for each sport and provides a comprehensive view of all team standings with win/loss statistics.

## Table of Contents

1. [Architecture](#architecture)
2. [Data Flow](#data-flow)
3. [Business Logic](#business-logic)
4. [Components](#components)
5. [API Integration](#api-integration)
6. [User Interactions](#user-interactions)
7. [State Management](#state-management)

---

## Architecture

### Component Structure

```
standings/
├── standings.tsx                    # Main container component
├── standing-dialog-form.tsx         # Form for add/edit/delete operations
├── standings-cards.tsx              # Top 3 champion cards display
├── standings-cards-skeleton.tsx     # Loading state for cards
├── standings-table.tsx              # Full standings data table
├── standings-table-skeleton.tsx     # Loading state for table
├── columns.tsx                      # Table column definitions
├── sport-selector.tsx               # Sport selection dropdown
└── delete-confirm-dialog.tsx        # Deletion confirmation dialog
```

### Technology Stack

-   **React**: UI framework with hooks (useState, useEffect, useCallback, useMemo)
-   **TypeScript**: Type safety and enhanced developer experience
-   **React Hook Form**: Form state management and validation
-   **Zod**: Schema validation for form inputs
-   **Axios**: HTTP client for API requests
-   **Sonner**: Toast notifications for user feedback
-   **Prisma**: Database ORM types

---

## Data Flow

### Data Sources

The module integrates data from three primary sources:

1. **Champions Table** (Source of Truth for Rankings)

    - Stores official championship records
    - Contains rank (1, 2, or 3), team, sport, and date information
    - A team can hold multiple championship ranks

2. **Games Table**

    - Records of all games played
    - Used to calculate win/loss statistics
    - Contains team scores and match results

3. **Teams Table**
    - Master list of all participating teams
    - Used for team selection in forms

### Data Fetching Strategy

```typescript
// Static Data (Fetched Once on Mount)
- Sports/GameTypes list
- Teams list

// Dynamic Data (Fetched per Sport Selection)
- Champions data (filtered by sport)
- Games data (filtered by sport)
```

### Data Transformation Pipeline

```
1. Fetch champions + games for selected sport
2. Transform games → standings statistics (wins/losses/win%)
3. Merge champions with game statistics
4. Add champions without game history (0 wins/losses)
5. Create top 3 cards array (with TBD placeholders)
6. Render UI with transformed data
```

---

## Business Logic

### Championship Ranking System

#### Rank Definitions

-   **Rank 1**: Champion (Gold/Yellow color: #907C4B)
-   **Rank 2**: First Runner-Up (Silver/Gray color: #727272)
-   **Rank 3**: Second Runner-Up (Bronze/Brown color: #683C13)
-   **Rank 0**: Unranked teams (teams without championship status)

#### Key Rules

1. **Multiple Championships**: A team can hold multiple ranks simultaneously

    - Example: Team A could be Rank 1 in Basketball and Rank 3 in Volleyball

2. **TBD (To Be Determined)**: Ranks without assigned champions

    - Displayed with gray background (#9CA3AF)
    - Shows "?" icon and "-" for statistics
    - Can be clicked to assign a champion

3. **Champions Without Game History**: Valid and displayed
    - Shows champion card with 0 wins/0 losses
    - Appears in both cards section and full table
    - Allows documenting championships even without recorded games

### Standings Calculation

```typescript
// Win Percentage Formula
winPercentage = (wins / (wins + losses)) × 100

// Special Cases
- No games played: 0.00%
- All wins: 100.00%
- All losses: 0.00%
```

### Data Priority Rules

1. **Champions Table** = Source of truth for rankings
2. **Games Table** = Source for statistics only
3. If conflict exists, Champions table takes precedence
4. Teams with games but no champion status → Rank 0 (unranked)

---

## Components

### 1. Standings (Main Component)

**File**: `standings.tsx`

**Responsibilities**:

-   Orchestrates all child components
-   Manages state for sports, teams, champions, and standings
-   Handles data fetching and transformation
-   Controls dialog visibility and form data

**State Management**:

```typescript
// Static Data
gameTypes: GameType[]
teams: Team[]

// Dynamic Data
selectedSport: number | null
championsData: ChampionData[]
standingsData: StandingWithRank[]

// UI State
loading: boolean
showDialog: boolean
formData: EditChampionPayload | null
```

**Key Functions**:

-   `fetchStaticData()`: Loads sports and teams once on mount
-   `fetchStandingsData()`: Loads champions and games for selected sport
-   `handleCardClick(rank)`: Opens dialog for editing specific rank
-   `handleAddStanding()`: Opens dialog to add new champion
-   `handleCloseDialog(dataChanged)`: Closes dialog and conditionally refetches data

**Performance Optimizations**:

-   `useMemo` for computed values (sportName, topThreeCards)
-   `useCallback` for handler functions to prevent re-renders
-   Static data cached to avoid repeated API calls

---

### 2. StandingFormDialog

**File**: `standing-dialog-form.tsx`

**Responsibilities**:

-   Add/Edit/Delete champion records
-   Form validation and submission
-   Date handling (single date for both start/end)
-   Error handling and user feedback

**Form Fields**:

```typescript
{
    id: number; // -1 for new records
    gameTypeId: number; // Selected sport
    rank: 1 | 2 | 3; // Championship rank
    teamId: number; // Selected team (-1 for TBD)
    startDate: string; // ISO date string
    endDate: string; // Same as startDate
}
```

**Validation Rules** (via Zod schema):

-   All fields required
-   Team must be selected (teamId !== -1)
-   Rank must be between 1-3
-   Dates must be valid ISO format

**Form Modes**:

-   **Add Mode**: Creates new champion record (id = -1)
-   **Edit Mode**: Updates existing record (id > 0)
-   **Delete**: Only available in edit mode, removes record

**User Experience Features**:

-   Form auto-populates with initial data
-   All fields disabled during submission
-   Loading spinners on buttons
-   Dialog cannot be closed during submission
-   Field-level and form-level error messages
-   Success/error toast notifications

**Data Change Tracking**:

```typescript
onCloseAction(dataChanged: boolean)
// true = data was added/updated/deleted → refetch required
// false = dialog closed without changes → no refetch needed
```

---

### 3. Cards (Top 3 Champions Display)

**File**: `standings-cards.tsx`

**Visual Hierarchy**:

```
┌─────────────────────────────────────┐
│ TEAM NAME                      LOGO │
│                                     │
│ GAMES WON        WIN %              │
│    15            75.00%             │
└─────────────────────────────────────┘
│ SPORT NAME          CHAMPION        │  ← Colored footer
└─────────────────────────────────────┘
```

**Color Scheme**:

-   Champion (Rank 1): Gold/Yellow (#907C4B)
-   First Runner-Up (Rank 2): Silver/Gray (#727272)
-   Second Runner-Up (Rank 3): Bronze/Brown (#683C13)
-   TBD: Gray (#9CA3AF)

**Interaction**:

-   Cards are clickable (cursor: pointer)
-   Hover effect: slight scale up (1.01)
-   Opens dialog for editing that specific rank

---

### 4. DataTable (Full Standings)

**File**: `standings-table.tsx`

**Displays**:

-   All teams (ranked and unranked)
-   Win/loss statistics for each team
-   Win percentage
-   Sort/filter capabilities

**Columns** (defined in `columns.tsx`):

-   Rank (1, 2, 3, or 0 for unranked)
-   Team Name
-   Wins
-   Losses
-   Win Percentage
-   Sport Name

---

## API Integration

### Endpoints Used

#### 1. GET `/api/sports`

**Purpose**: Fetch all available sports/game types

**Response**:

```typescript
{
  sports: GameType[]
}
```

---

#### 2. GET `/api/teams`

**Purpose**: Fetch all participating teams

**Response**:

```typescript
{
  teams: Team[]
}
```

---

#### 3. GET `/api/champions?gameTypeId={id}`

**Purpose**: Fetch championship records for specific sport

**Query Parameters**:

-   `gameTypeId`: Sport ID to filter by

**Response**:

```typescript
{
    champions: Array<{
        id: number;
        rank: number;
        gameTypeId: number;
        teamId: number;
        startDate: string;
        endDate: string;
        gameType: { id: number; gameName: string };
        team: { id: number; teamName: string };
    }>;
}
```

---

#### 4. GET `/api/games?gameTypeId={id}`

**Purpose**: Fetch game records for statistics calculation

**Query Parameters**:

-   `gameTypeId`: Sport ID to filter by

**Response**:

```typescript
{
    games: Array<{
        id: number;
        teamAId: number;
        teamBId: number;
        teamAScore: number | null;
        teamBScore: number | null;
        winnerId: number | null;
        gameTypeId: number;
        // ... other fields
    }>;
}
```

---

#### 5. POST `/api/champions`

**Purpose**: Create new champion record

**Request Body**:

```typescript
{
    gameTypeId: number;
    teamId: number;
    rank: number;
    startDate: string; // ISO format
    endDate: string; // ISO format
}
```

**Response**: 201 Created

---

#### 6. PUT `/api/champions`

**Purpose**: Update existing champion record

**Request Body**:

```typescript
{
    id: number;
    gameTypeId: number;
    teamId: number;
    rank: number;
    startDate: string;
    endDate: string;
}
```

**Response**: 200 OK

---

#### 7. DELETE `/api/champions`

**Purpose**: Delete champion record

**Request Body**:

```typescript
{
    id: number;
}
```

**Response**: 200 OK

---

## User Interactions

### User Roles

#### 1. Public Users (Non-Admin)

**Capabilities**:

-   View sport selector
-   See top 3 champion cards
-   View full standings table
-   Cannot edit or add standings

**UI Elements Visible**:

-   Sport selector dropdown
-   Champion cards (non-clickable for non-admins)
-   Standings table

---

#### 2. Admin Users (Authenticated)

**Capabilities**:

-   All public user capabilities
-   Click cards to edit champions
-   Add new champions via "+ Add Standing" button
-   Delete existing champions

**UI Elements Visible**:

-   All public elements
-   "+ Add Standing" button
-   Clickable champion cards
-   Edit/Delete dialog

---

### User Workflows

#### Workflow 1: View Standings

```
1. User lands on standings page
2. Select sport from dropdown
3. System loads and displays:
   - Top 3 champion cards
   - Full standings table with all teams
4. User can change sport selection to view different standings
```

#### Workflow 2: Add Champion (Admin Only)

```
1. Admin selects a sport
2. Clicks "+ Add Standing" button
3. Dialog opens with form:
   - Date picker (pre-filled with today)
   - Team selector (searchable dropdown)
   - Rank selector (Champion/1st/2nd Runner-Up)
4. Admin fills form
5. Clicks "Add Standing"
6. System validates and saves
7. Success toast shown
8. Dialog closes
9. Data automatically refetches
10. UI updates with new champion
```

#### Workflow 3: Edit Champion (Admin Only)

```
1. Admin clicks on a champion card (or TBD card)
2. Dialog opens pre-populated with existing data
3. Admin modifies fields as needed
4. Clicks "Save Changes"
5. System validates and updates
6. Success toast shown
7. Dialog closes and data refetches
```

#### Workflow 4: Delete Champion (Admin Only)

```
1. Admin clicks on a champion card
2. Dialog opens in edit mode
3. Admin clicks "Delete" button (red, on left)
4. System deletes the record
5. Success toast shown
6. Dialog closes and data refetches
7. Card reverts to TBD state
```

#### Workflow 5: Assign TBD Champion (Admin Only)

```
1. Admin sees "TBD" card for a rank
2. Clicks the TBD card
3. Dialog opens in "add" mode
4. Rank is pre-filled with clicked position
5. Admin selects team and date
6. Clicks "Add Standing"
7. TBD card updates with team information
```

---

## State Management

### Component State Lifecycle

```
1. MOUNT
   ├─ Fetch static data (sports, teams)
   └─ Initialize empty dynamic data

2. SPORT SELECTION
   ├─ Set loading state
   ├─ Fetch champions data
   ├─ Fetch games data
   ├─ Transform and merge data
   ├─ Calculate top 3 cards
   └─ Render UI

3. DIALOG OPEN
   ├─ Set formData with initial values
   ├─ Show dialog
   └─ Wait for user action

4. FORM SUBMISSION
   ├─ Set submitting state
   ├─ Disable all fields
   ├─ Send API request
   ├─ Handle response
   └─ Close dialog with dataChanged flag

5. DIALOG CLOSE
   ├─ Clear formData
   ├─ Hide dialog
   └─ Conditionally refetch (if dataChanged = true)

6. DATA REFETCH
   ├─ Set loading state
   ├─ Re-fetch champions and games
   ├─ Re-transform data
   └─ Update UI
```

### Performance Considerations

**Memoization Strategy**:

```typescript
// Computed once, cached until dependencies change
sportName = useMemo(() => findSport(), [gameTypes, selectedSport]);
topThreeCards = useMemo(() => buildCards(), [champions, standings, sportName]);

// Functions memoized to prevent child re-renders
handleCardClick = useCallback(() => {}, [champions, selectedSport]);
handleAddStanding = useCallback(() => {}, [selectedSport]);
handleCloseDialog = useCallback(() => {}, [fetchStandingsData]);
```

**Data Fetching Optimization**:

-   Static data fetched once on mount
-   Dynamic data only fetched when sport changes
-   Conditional refetch only when data actually changes
-   Parallel API requests using `Promise.all()`

---

## Error Handling

### Error Types and Responses

#### 1. Network Errors

**Scenario**: API request fails

**Handling**:

```typescript
try {
    const response = await axios.get("/api/champions");
} catch (error) {
    console.error("Error:", error);
    toast.error("Failed to load standings data");
    setStandingsData([]); // Set to empty array
}
```

**User Experience**:

-   Toast notification with error message
-   Loading state removed
-   Empty state shown (no crash)

---

#### 2. Validation Errors

**Scenario**: Form submitted with invalid data

**Handling**:

-   React Hook Form + Zod validation
-   Field-level errors shown below inputs
-   Form-level errors shown in alert box
-   Submit button disabled during validation

**Example Validation**:

```typescript
teamId: z.number().refine((val) => val !== -1, {
    message: "Please select a team",
});
```

---

#### 3. API Errors (4xx, 5xx)

**Scenario**: API returns error response

**Handling**:

```typescript
if (axios.isAxiosError(error)) {
    const errorMessage = error.response?.data?.error || "Default message";
    toast.error(errorMessage);
    setError("root", { message: errorMessage });
}
```

**User Experience**:

-   Specific error message from API
-   Toast notification
-   Form error display
-   Form remains open for correction

---

## Data Integrity Rules

### Business Rules Enforcement

1. **Unique Rank per Sport**

    - Each sport can only have ONE team at each rank (1, 2, 3)
    - Backend should enforce this constraint
    - Frontend validation prevents conflicts

2. **Valid Team Selection**

    - Team must exist in teams table
    - Team ID cannot be -1 in final submission
    - Validation error if invalid

3. **Valid Date Range**

    - Dates must be in valid ISO format
    - Start date = End date (business rule)
    - System uses single date for both fields

4. **Rank Constraints**
    - Rank must be 1, 2, or 3
    - No other values allowed
    - Enforced by form dropdown and validation

---

## Testing Scenarios

### Critical Test Cases

#### 1. Empty State

-   No sport selected
-   No data displayed
-   Selectors work correctly

#### 2. Sport with No Champions

-   3 TBD cards shown
-   Empty standings table
-   Admin can add champions

#### 3. Sport with Partial Champions

-   Rank 1 has team, Ranks 2-3 are TBD
-   Mix of TBD and champion cards
-   Can edit both existing and TBD

#### 4. Champions Without Games

-   Champion card shows 0-0 record
-   Appears in standings table
-   Win percentage is 0.00%

#### 5. Team with Multiple Championships

-   Same team appears in multiple ranks
-   Each rank shows correct data
-   No conflicts in display

#### 6. Form Validation

-   Empty team selection → Error
-   Invalid date → Error
-   All fields required → Errors

#### 7. Data Refetch Logic

-   Cancel dialog → No refetch
-   Successful save → Refetch
-   Failed save → No refetch

---

## Future Enhancements

### Potential Improvements

1. **Real-time Updates**

    - WebSocket integration for live standings
    - Automatic refresh when data changes

2. **Historical Records**

    - View past championships
    - Date range filtering
    - Championship history timeline

3. **Bulk Operations**

    - Import multiple champions via CSV
    - Batch edit functionality

4. **Enhanced Statistics**

    - Head-to-head records
    - Trend analysis
    - Performance graphs

5. **Advanced Filtering**

    - Filter by date range
    - Filter by team
    - Search functionality

6. **Export Functionality**
    - Export standings to PDF
    - Generate reports
    - Share functionality

---

## Troubleshooting

### Common Issues

#### Issue: Cards not updating after edit

**Cause**: dataChanged flag not set correctly
**Solution**: Verify onCloseAction(true) called on success

#### Issue: TBD showing team ID "-1"

**Cause**: SearchableSelect value handling
**Solution**: Check value prop uses conditional logic

#### Issue: Form not pre-populating

**Cause**: Date format mismatch
**Solution**: Ensure dates split by 'T' before passing to form

#### Issue: Duplicate teams in standings

**Cause**: Data merge logic issue
**Solution**: Check champion existence before adding

#### Issue: Loading spinner never stops

**Cause**: API call error not caught
**Solution**: Ensure finally block always calls setLoading(false)

---

## Maintenance Notes

### Code Ownership

-   **Primary Component**: `standings.tsx`
-   **Form Logic**: `standing-dialog-form.tsx`
-   **Data Transformation**: `transformGamesToSchoolRank()` helper

### Dependencies to Monitor

-   `@tanstack/react-table` (data table)
-   `react-hook-form` (form handling)
-   `zod` (validation)
-   `axios` (HTTP client)
-   `sonner` (toasts)

### Database Schema Dependencies

```prisma
model Champion {
  id         Int      @id @default(autoincrement())
  gameTypeId Int
  teamId     Int
  rank       Int
  startDate  DateTime
  endDate    DateTime
  gameType   GameType @relation(...)
  team       Team     @relation(...)
}
```

---

## Contact & Support

For questions or issues related to the Standings module:

-   Check this documentation first
-   Review error logs in console
-   Test in isolation with mock data
-   Verify API endpoints are functional

---

## Disclaimer

This documentation was generated by AI and reviewed by **Neal Andrew Peteros, CTO**.

**Created**: December 5, 2025

**Last Updated**: December 5, 2025

**Version**: 1.0.0

**Module**: Standings Management System
