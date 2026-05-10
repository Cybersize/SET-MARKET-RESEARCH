import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Database, Key, AlertTriangle } from 'lucide-react';

export function FirebaseSetupScreen() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Database className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold font-mono text-foreground">SET Research</h1>
          <p className="text-muted-foreground text-sm">Firebase configuration required</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <CardTitle className="text-base">Firebase Not Configured</CardTitle>
            </div>
            <CardDescription>
              Add your Firebase project credentials as environment secrets to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[
                'VITE_FIREBASE_API_KEY',
                'VITE_FIREBASE_AUTH_DOMAIN',
                'VITE_FIREBASE_PROJECT_ID',
                'VITE_FIREBASE_STORAGE_BUCKET',
                'VITE_FIREBASE_MESSAGING_SENDER_ID',
                'VITE_FIREBASE_APP_ID',
              ].map(key => (
                <div key={key} className="flex items-center gap-2 px-3 py-2 bg-muted/30 rounded-md border border-border">
                  <Key className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="font-mono text-xs text-foreground">{key}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Find these values in your Firebase console under{' '}
              <span className="font-mono text-foreground">Project Settings → General → Your apps → SDK setup</span>.
              Add them as Secrets in your Replit project, then restart the app.
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-sm font-mono">Firebase Setup Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-xs text-muted-foreground list-decimal list-inside leading-relaxed">
              <li>Go to <span className="font-mono text-foreground">console.firebase.google.com</span></li>
              <li>Create a new project or select an existing one</li>
              <li>Enable <span className="font-mono text-foreground">Authentication → Sign-in method → Email/Password</span></li>
              <li>Create your admin user under <span className="font-mono text-foreground">Authentication → Users</span></li>
              <li>Enable <span className="font-mono text-foreground">Firestore Database</span> (production mode)</li>
              <li>Go to <span className="font-mono text-foreground">Project Settings → General</span> and copy your web app config</li>
              <li>Add each value as a Secret in this Replit project</li>
              <li>Apply the Firestore security rules shown in the Admin panel</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
