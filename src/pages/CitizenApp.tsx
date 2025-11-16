import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const mockNotifications = [
  {
    id: 1,
    title: "Δήμος Αθηναίων",
    time: "τώρα",
    greeting: "Αγαπητέ πολίτη,",
    message: "Το κοινωνικό παντοπωλείο θα είναι στην περιοχή σας στις 20/11 ώρα 12:00-14:30",
    sender: "Δήμος Αθηναίων",
    action: "Απεγγραφή από ειδοποιήσεις"
  },
  {
    id: 2,
    title: "Δήμος Αθηναίων",
    time: "πριν 2 ώρες",
    message: "Υπενθύμιση: Η επόμενη συνάντηση με τον κοινωνικό λειτουργό είναι προγραμματισμένη για την Παρασκευή.",
    sender: "Δήμος Αθηναίων"
  }
];

const CitizenApp = () => {

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      {/* Phone Frame */}
      <div className="relative w-[390px] h-[844px] bg-black rounded-[60px] shadow-2xl border-[14px] border-black overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[30px] bg-black rounded-b-3xl z-50" />
        
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-[50px] flex items-start justify-between px-8 pt-3 text-white z-40">
          <div className="text-[17px] font-semibold">9:41</div>
          <div className="flex items-center gap-1.5">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <path d="M1 5C1 3.34315 2.34315 2 4 2H13C14.6569 2 16 3.34315 16 5V7C16 8.65685 14.6569 10 13 10H4C2.34315 10 1 8.65685 1 7V5Z" fill="white" fillOpacity="0.4"/>
              <path d="M2 5C2 3.89543 2.89543 3 4 3H13C14.1046 3 15 3.89543 15 5V7C15 8.10457 14.1046 9 13 9H4C2.89543 9 2 8.10457 2 7V5Z" fill="white"/>
            </svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
              <rect opacity="0.35" x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white"/>
              <path opacity="0.4" d="M23 4V8C24.3807 7.66122 25.5 6.45267 25.5 5C25.5 3.54733 24.3807 2.33878 23 2V4Z" fill="white"/>
              <rect x="2" y="2" width="18" height="8" rx="1.5" fill="white"/>
            </svg>
          </div>
        </div>

        {/* App Content */}
        <div className="h-full overflow-y-auto bg-gradient-to-b from-background to-muted">
          {/* Lock screen style header */}
          <div className="pt-16 pb-8 text-center">
            <div className="text-7xl font-light mb-2">9:41</div>
            <div className="text-muted-foreground">Τετάρτη, 16 Νοεμβρίου</div>
          </div>

          {/* Notifications */}
          <div className="px-4 space-y-4 max-w-md mx-auto">
            {mockNotifications.map((notification) => (
              <Card 
                key={notification.id} 
                className="backdrop-blur-xl bg-card/95 shadow-lg border-border/50"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{notification.title}</span>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      {notification.greeting && (
                        <p className="text-sm mb-2">{notification.greeting}</p>
                      )}
                      <p className="text-sm text-foreground/90 mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      <div className="text-xs text-muted-foreground mb-2">
                        {notification.sender}
                      </div>
                      {notification.action && (
                        <button className="text-sm text-primary font-medium">
                          {notification.action}
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom padding */}
          <div className="h-20" />
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white rounded-full opacity-60" />
      </div>
    </div>
  );
};

export default CitizenApp;
