import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import type { Config } from '../lib/types';
import { Button } from './ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

type SettingsProps = {
  config: Config;
};

export const Settings = ({ config }: SettingsProps) => {
  const [store, setStore] = useState<string>(config.store);

  const chooseFolder = async () => {
    const selected = await open({ multiple: false, directory: true });
    if (typeof selected === 'string') setStore(selected);
  };

  const handleSave = () => {
    invoke('save_config', { config: { store } })
      .then(() => toast.success('Successfully saved configuration.'))
      .catch((error) => toast.error(`Failed to save configuration: ${error}`));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' size='icon'>
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Update your preferences here. Click save when you're finished.
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center space-x-2'>
          <div>
            <Label htmlFor='path' className='text-right'>
              Store
            </Label>
            <p className='text-sm text-muted-foreground'>
              Choose the folder where your notes will be stored.
            </p>
          </div>
          <Input
            onClick={chooseFolder}
            placeholder={store || 'Choose folder...'}
            readOnly
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSave}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
