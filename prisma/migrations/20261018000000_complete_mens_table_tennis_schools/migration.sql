-- Add missing Men's Table Tennis assignments for the seven school teams.
-- Exclude named squads and International Students; preserve existing assignments.
INSERT INTO team_game_types (game_type_id, team_id)
SELECT gt.id, t.id
FROM teams t
JOIN schools s
  ON s.id = t.school_id
 AND t.team_name = s.school_name
CROSS JOIN game_types gt
WHERE gt.game_name = 'Men''s Table Tennis'
  AND s.school_name IN (
    'SAFAD', 'SAS', 'SBE', 'SED', 'SHCP', 'SLG', 'SOE'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM team_game_types existing
    WHERE existing.game_type_id = gt.id
      AND existing.team_id = t.id
  );
