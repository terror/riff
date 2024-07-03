import { open } from '@tauri-apps/api/dialog';
import { invoke } from '@tauri-apps/api/tauri';
import { Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { type Config, Model } from '../lib/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

type SettingsProps = {
  config: Config;
};

export const Settings = ({ config }: SettingsProps) => {
  const [store, setStore] = useState<string>(config.store);

  const [openAiApiKey, setOpenAiApiKey] = useState<string | undefined>(
    config.openAiApiKey
  );

  const [openAiModel, setOpenAiModel] = useState<Model>(
    config.model || Model.Gpt35Turbo
  );

  const chooseFolder = async () => {
    const selected = await open({ multiple: false, directory: true });
    if (typeof selected === 'string') setStore(selected);
  };

  const handleSave = () => {
    invoke('save_config', {
      config: { store, openAiApiKey, model: openAiModel },
    })
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
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Update your preferences here. Click save when you're finished.
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-6 py-4'>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>Storage</h4>
            <p className='text-sm text-muted-foreground'>
              Choose the folder where your notes will be stored.
            </p>
            <Input
              id='path'
              onClick={chooseFolder}
              placeholder={store || 'Choose folder...'}
              readOnly
              className='mt-1.5'
            />
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>OpenAI API Key</h4>
            <p className='text-sm text-muted-foreground'>
              Enter your OpenAI API key for AI-powered features.
            </p>
            <Input
              id='openAiApiKey'
              type='password'
              value={openAiApiKey || ''}
              onChange={(e) => setOpenAiApiKey(e.target.value)}
              placeholder='Enter your OpenAI API key'
              className='mt-1.5'
            />
          </div>
          <div className='space-y-2'>
            <h4 className='font-medium leading-none'>OpenAI Model</h4>
            <p className='text-sm text-muted-foreground'>
              Choose the OpenAI text-based model you want to use.
            </p>
            <Select
              value={openAiModel}
              onValueChange={(value: Model) => setOpenAiModel(value)}
            >
              <SelectTrigger id='openAiModel' className='mt-1.5'>
                <SelectValue placeholder='Select a model' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(Model).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
