import { useEffect, useRef, useState } from 'react';
import { DialogOverlay, DialogFooter, DialogHeader,  DialogContent, DialogTitle, DialogPortal, Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface AddScoreDialogProps {
  isOpen: boolean;
  selectedRecord: any;
  onCancel: () => void;
  onSave: () => void;
}

interface ScoreInputs {
  schedule?: string;
  homeScore?: number;
  awayScore?: number;
}

const AddScoreDialog: React.FC<AddScoreDialogProps> = ({ isOpen, selectedRecord, onCancel, onSave }) => {
  const [scoreInputs, setScoreInputs] = useState({} as ScoreInputs);
  const [homeTeam, setHomeTeam] = useState("Team A");
  const [awayTeam, setAwayTeam] = useState("Team B");
  let open = useRef(isOpen);
  
  const prev = useRef({isOpen, selectedRecord, onCancel, onSave, scoreInputs});

  useEffect(() => {
    if (isOpen) {
      setupForm();
      open.current = true;
    }
  }, [isOpen]);

  const setOpen = () => {
    open.current = !open.current;
    if(!open.current) {
      onCancel();
    }
  };

  useEffect(() => {
    console.log(scoreInputs);
  }, [scoreInputs]);
  

  const handleCancel = () => {
    open.current = false;
    onCancel();
  };

  const handleSave = () => {
    // Add save logic here
    onSave();
  };

  const setupForm = () => {
    // make inputs as necessary
    if(selectedRecord) {
      setScoreInputs({
        schedule: selectedRecord?.schedule,
        homeScore: selectedRecord?.scores.home,
        awayScore: selectedRecord?.scores.away
      });
      setHomeTeam(selectedRecord?.teams.home);
      setAwayTeam(selectedRecord?.teams.away);

      console.log(scoreInputs, homeTeam, awayTeam);
    } else {
      setScoreInputs({});
      setHomeTeam("Team A");
      setAwayTeam("Team B");
    }
  };

  const setScore = (event: any) => {
    const { name, value } = event.target;
    let currentInputs = {...scoreInputs};
    const prop = name == 'homeScore' ? 'homeScore' : 'awayScore';

    if(!value) {
      delete currentInputs[prop];
    } else {
      currentInputs[prop] = parseInt(value);
    }

    setScoreInputs(currentInputs);
  }

  const changeSchedule = (value: any) => {
    let currentInputs = {...scoreInputs};

    if(!value) {
      delete currentInputs['schedule'];
    } else {
      currentInputs['schedule'] = value;
    }

    setScoreInputs(currentInputs);
  };

  return (
    <Dialog open={open.current} onOpenChange={setOpen}>
      <DialogPortal>
        <DialogOverlay>
          <DialogContent>
            <DialogHeader onAbort={handleCancel}>
              <DialogTitle>Add Score</DialogTitle>
            </DialogHeader>

            {/* FORM FIELDS */}
              <label>Schedule</label>
              <Select name="schedule" onValueChange={changeSchedule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={"yes"}>Yes</SelectItem>
                  <SelectItem value={"no"}>No</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex justify-between row">
                <div>
                  <label>Home Score ({homeTeam})</label>
                  <Input type="number" name="homeScore" value={scoreInputs.homeScore} onChange={setScore} />
                </div>

                <div>
                  <label>Away Score ({awayTeam})</label>
                  <Input type="number" name="awayScore" value={scoreInputs.awayScore} onChange={setScore} />
                </div>
              </div>

              {/* / FORM FIELDS */}
            <DialogFooter>
              <Button onClick={handleCancel} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
};

export default AddScoreDialog;