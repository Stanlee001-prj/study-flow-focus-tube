
import { Download, Chrome, Play, Settings, Clock, Shield, BookOpen, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: "Pomodoro Timer",
      description: "Built-in 25/5 minute study cycles with motivational tips"
    },
    {
      icon: <Shield className="h-8 w-8 text-red-500" />,
      title: "Distraction Blocker",
      description: "Smart detection of non-educational content with gentle warnings"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-green-500" />,
      title: "Subject Filtering",
      description: "Filter YouTube content by educational subjects and topics"
    },
    {
      icon: <Moon className="h-8 w-8 text-purple-500" />,
      title: "Night Mode",
      description: "Easy on the eyes dark theme for extended study sessions"
    }
  ];

  const handleDownload = () => {
    // Create a simple instruction alert
    alert(`To install EduFocus Chrome Extension:

1. Download all extension files from the 'public' folder
2. Open Chrome and go to chrome://extensions/  
3. Enable "Developer mode" (top right toggle)
4. Click "Load unpacked" and select the folder containing the extension files
5. The EduFocus extension will appear in your toolbar!

Files needed:
- manifest.json
- popup.html
- popup.css  
- popup.js
- content.js
- inject.css
- icon files (16px, 48px, 128px)`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              🎓
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              EduFocus
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform YouTube into a focused learning environment with study timers, distraction blocking, and educational content filtering.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Chrome Extension
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Study Tool
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Productivity
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Stay Focused on Learning
                </h2>
                <p className="text-gray-600 mb-6">
                  EduFocus helps students maintain focus while using YouTube for educational purposes. 
                  Block distractions, track study time, and filter content to create the perfect learning environment.
                </p>
                <div className="flex gap-4">
                  <Button onClick={handleDownload} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download Extension
                  </Button>
                  <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                    <Chrome className="mr-2 h-4 w-4" />
                    Chrome Only
                  </Button>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl p-6 h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl mb-4 mx-auto">
                      ⏱️
                    </div>
                    <p className="text-blue-700 font-semibold">25:00</p>
                    <p className="text-blue-600 text-sm">Focus Time</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Focused Learning
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How EduFocus Works
          </h2>
          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Install & Setup</h3>
                <p className="text-gray-600">Download and install the extension, then access it from your Chrome toolbar.</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Configure Your Study Session</h3>
                <p className="text-gray-600">Set your preferred subject filter, start the Pomodoro timer, and enable distraction warnings.</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Focus & Learn</h3>
                <p className="text-gray-600">Browse YouTube with confidence knowing EduFocus is keeping you on track with your educational goals.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Instructions */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Installation Instructions
            </h2>
            <Card>
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <p className="text-gray-700">Download all extension files from the project's <code className="bg-gray-100 px-2 py-1 rounded">public</code> folder</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <p className="text-gray-700">Open Google Chrome and navigate to <code className="bg-gray-100 px-2 py-1 rounded">chrome://extensions/</code></p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <p className="text-gray-700">Enable "Developer mode" using the toggle switch in the top right corner</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">4</span>
                    </div>
                    <p className="text-gray-700">Click "Load unpacked" and select the folder containing all the extension files</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <p className="text-gray-700">EduFocus will now appear in your Chrome toolbar - click to start focusing!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            EduFocus - Making YouTube a better learning platform, one student at a time.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Built with modern web technologies for Chrome browsers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
