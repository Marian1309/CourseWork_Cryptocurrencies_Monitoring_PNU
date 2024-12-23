'use client';

import { useEffect, useState } from 'react';

import prettyPrint from '@/lib/pretty-print';

import { toast } from '@/hooks/use-toast';

import { useSettings } from '@/context/settings';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Loader from '@/components/ui/loader';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();

  prettyPrint({ settings });

  const [temporarySettings, setTemporarySettings] = useState(settings);
  const handleSave = () => {
    if (temporarySettings) {
      updateSettings(temporarySettings);
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated.'
      });
    }
  };

  useEffect(() => {
    setTemporarySettings(settings);
  }, [settings]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Settings</h1>

      <Tabs className="space-y-4" defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
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
                    onValueChange={(value) =>
                      setTemporarySettings((previous) => ({
                        ...previous!,
                        theme: value as 'light' | 'dark' | 'system'
                      }))
                    }
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
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    onValueChange={(value) =>
                      setTemporarySettings((previous) => ({
                        ...previous!,
                        currency: value as 'USD' | 'EUR' | 'GBP'
                      }))
                    }
                    value={temporarySettings?.currency}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                    </SelectContent>
                  </Select>
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
                <Label htmlFor="news-updates">News Updates</Label>
                <Switch
                  checked={temporarySettings?.newsUpdates}
                  id="news-updates"
                  onCheckedChange={(checked) =>
                    setTemporarySettings((previous) => ({
                      ...previous!,
                      newsUpdates: checked
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
                      displayMode: value as 'compact' | 'comfortable'
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
                      defaultView: value as 'list' | 'grid'
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
                <Label htmlFor="email">Email</Label>
                <input
                  className="w-full rounded border p-2"
                  id="email"
                  placeholder="your@email.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <input
                  className="w-full rounded border p-2"
                  id="password"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
              <Button variant="outline">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end space-x-4">
        <Button onClick={() => setTemporarySettings(settings)} variant="outline">
          Cancel
        </Button>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}
