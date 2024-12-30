'use client';

import type { FC } from 'react';
import { useEffect, useState, useTransition } from 'react';

import { useUser } from '@clerk/nextjs';
import type { DefaultView, DisplayMode, Settings } from '@prisma/client';

import { toast } from '@/hooks/use-toast';

import { useSettings } from '@/context/settings';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/loader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Saving from './_components/saving';

export const runtime = 'edge';

const SettingsPage: FC = () => {
  const { settings, updateSettings } = useSettings();
  const [temporarySettings, setTemporarySettings] = useState<Settings | undefined>();

  const [userFullName, setUserFullName] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (settings && !temporarySettings) {
      setTemporarySettings(settings);
    }
  }, [settings, temporarySettings]);

  const handleSave = () => {
    if (temporarySettings) {
      startTransition(async () => {
        await updateSettings({ ...temporarySettings, fullName: userFullName });
        toast({
          title: 'Settings saved',
          description: 'Your preferences have been updated.',
          duration: 1500
        });
      });
    }
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setTemporarySettings({ ...temporarySettings, theme } as any);
  };

  const { user } = useUser();

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>

      <Tabs className="space-y-4" defaultValue="general">
        <TabsList className="flex">
          <TabsTrigger className="flex-1" value="general">
            General
          </TabsTrigger>

          <TabsTrigger className="flex-1" value="notifications">
            Notifications
          </TabsTrigger>

          <TabsTrigger className="flex-1" value="display">
            Display
          </TabsTrigger>

          <TabsTrigger className="flex-1" value="account">
            Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          {settings ? (
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your general preferences</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <RadioGroup
                    className="flex space-x-4"
                    id="theme"
                    onValueChange={handleThemeChange}
                    value={temporarySettings?.theme}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="light" value="light" />
                      <Label htmlFor="light">Light</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="dark" value="dark" />
                      <Label htmlFor="dark">Dark</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem id="system" value="system" />
                      <Label htmlFor="system">System</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="refresh-interval">Refresh Interval (seconds)</Label>
                  <Slider
                    id="refresh-interval"
                    max={300}
                    min={5}
                    onValueChange={(value) =>
                      setTemporarySettings((previous) => ({
                        ...previous!,
                        refreshInterval: value[0] * 1000
                      }))
                    }
                    step={5}
                    value={[
                      temporarySettings?.refreshInterval
                        ? temporarySettings?.refreshInterval / 1000
                        : 5
                    ]}
                  />
                  <div className="text-sm text-gray-500">
                    {temporarySettings?.refreshInterval
                      ? temporarySettings?.refreshInterval / 1000
                      : 5}
                    seconds
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Loader className="h-[289px] flex-center" />
          )}
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="price-alerts">Price Alerts</Label>
                <Switch
                  checked={temporarySettings?.priceAlerts}
                  id="price-alerts"
                  onCheckedChange={(checked) =>
                    setTemporarySettings((previous) => ({
                      ...previous!,
                      priceAlerts: checked
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="portfolio-summary">Portfolio Summary</Label>
                <Switch
                  checked={temporarySettings?.portfolioSummary}
                  id="portfolio-summary"
                  onCheckedChange={(checked) =>
                    setTemporarySettings((previous) => ({
                      ...previous!,
                      portfolioSummary: checked
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>Customize your viewing experience</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="display-mode">Display Mode</Label>
                <RadioGroup
                  className="flex space-x-4"
                  id="display-mode"
                  onValueChange={(value) =>
                    setTemporarySettings((previous) => ({
                      ...previous!,
                      displayMode: value as DisplayMode
                    }))
                  }
                  value={temporarySettings?.displayMode}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="compact" value="compact" />
                    <Label htmlFor="compact">Compact</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="comfortable" value="comfortable" />
                    <Label htmlFor="comfortable">Comfortable</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-view">Default View</Label>
                <RadioGroup
                  className="flex space-x-4"
                  id="default-view"
                  onValueChange={(value) =>
                    setTemporarySettings((previous) => ({
                      ...previous!,
                      defaultView: value as DefaultView
                    }))
                  }
                  value={temporarySettings?.defaultView}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="list" value="list" />
                    <Label htmlFor="list">List</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem id="grid" value="grid" />
                    <Label htmlFor="grid">Grid</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  className="w-full rounded border p-2"
                  id="full-name"
                  onChange={(event) => setUserFullName(event.target.value)}
                  placeholder="John Doe"
                  type="text"
                  value={userFullName ?? settings?.fullName ?? ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  className="w-full rounded border p-2"
                  disabled={
                    user?.emailAddresses[0].emailAddress ===
                    user?.primaryEmailAddress?.emailAddress
                  }
                  id="email"
                  onChange={(event) =>
                    setTemporarySettings((previous) => ({
                      ...previous!,
                      email: event.target.value
                    }))
                  }
                  placeholder="your@email.com"
                  type="email"
                  value={settings?.email ?? user?.emailAddresses[0].emailAddress ?? ''}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Saving
        handleSave={handleSave}
        isLoading={isPending}
        setTemporarySettings={setTemporarySettings}
        settings={settings!}
      />
    </div>
  );
};

export default SettingsPage;
