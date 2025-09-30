"use client";
import { useState } from "react";
import { CardStack } from "@/components/ui/card-stack";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useEffect } from "react";

export function CardStackDemo({ onProgress }: { onProgress?: (current: number, total: number) => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [state, setState] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [current, setCurrent] = useState(0);
  // Step 2 state
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [energy, setEnergy] = useState("moderate");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [history, setHistory] = useState<{ [k: string]: boolean }>({
    heartDisease: false,
    diabetes: false,
    cancer: false,
    infection: false,
  });
  // Step 3 state
  const [service, setService] = useState<string[]>([]);
  // Step 4 state
  const [labLocation, setLabLocation] = useState("");
  const [consent, setConsent] = useState(false);

  const items = getStepZeroCards().concat(getStepOneCards({
    firstName,
    lastName,
    dob,
    state,
    email,
    phone,
    setFirstName,
    setLastName,
    setDob,
    setState,
    setEmail,
    setPhone,
  })).concat(
    getStepTwoCards({
      heightCm,
      weightKg,
      energy,
      setHeightCm,
      setWeightKg,
      setEnergy,
      concerns,
      setConcerns,
      history,
      setHistory,
    })
  ).concat(
    getStepThreeCards({
      service: service,
      setService: setService,
    })
  ).concat(
    getStepFourCards({
      labLocation,
      setLabLocation,
      consent,
      setConsent,
    })
  ).concat(
    getStepFiveCards()
  );

  const next = () => setCurrent((c) => Math.min(c + 1, items.length - 1));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));

  // Validation
  const [triedNext, setTriedNext] = useState(false);
  const currentId = items[current]?.id;
  const isValid = (() => {
    switch (currentId) {
      case -1:
        return true; // intro
      case 0:
        return firstName.trim().length > 0 && lastName.trim().length > 0;
      case 1:
        return dob.trim().length > 0 && ["WA","FL","GA","NE"].includes(state);
      case 2:
        return email.trim().length > 0 && phone.trim().length > 0;
      case 3:
        return heightCm.trim().length > 0 && weightKg.trim().length > 0;
      case 4:
        return ["low","moderate","high"].includes(energy);
      case 5:
        return concerns.length > 0; // pick at least one
      case 6:
        return true; // info only
      case 7:
        return service.length > 0; // pick at least one
      case 8:
        return labLocation.trim().length > 0 && consent;
      default:
        return true;
    }
  })();

  const handleNext = () => {
    if (!isValid) {
      setTriedNext(true);
      return;
    }
    setTriedNext(false);
    next();
  };

  useEffect(() => {
    onProgress?.(current, items.length);
    // only when current or total changes; onProgress is stable from parent via useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, items.length]);

  const isFirst = current === 0;
  const isLast = current === items.length - 1;

  return (
    <div className="h-[40rem] flex flex-col items-center justify-center w-full gap-6">
      <CardStack items={items} manual current={current} maxVisible={4} />
      <div className="flex items-center gap-6 mt-10">
        {!isFirst && !isLast && (
          <button
            type="button"
            onClick={prev}
            className="px-5 py-2.5 rounded-xl border bg-background hover:bg-muted text-foreground"
          >
            Back
          </button>
        )}
        {!isLast ? (
          <button
            type="button"
            onClick={handleNext}
            className={`px-5 py-2.5 rounded-xl text-white hover:opacity-90 ${isValid ? 'bg-brand' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}
          >
            {isFirst ? "Start" : "Next"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {/* submit wiring here soon */}}
            className="px-5 py-2.5 rounded-xl bg-brand text-white hover:opacity-90"
          >
            Submit
          </button>
        )}
      </div>
      {!isValid && triedNext && (
        <p className="text-xs text-destructive mt-2">
          Please complete the required fields before continuing.
        </p>
      )}
    </div>
  );
}

// Small utility to highlight the content of specific section of a testimonial content
export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

// Step 0: Entry
function getStepZeroCards() {
  return [
    {
      id: -1,
      name: "",
      designation: "",
      content: (
        <div className="flex items-center justify-center h-full min-h-60 text-center">
          <div className="space-y-3">
            <img src="/frame.png" alt="FRAME" className="h-10 mx-auto" />
            <h2 className="text-xl font-semibold">Start your assessment</h2>
            <p className="text-sm text-muted-foreground">
              Quick 6-step check to see if you're a candidate. Takes ~3 minutes.
            </p>
          </div>
        </div>
      ),
    },
  ];
}

function getStepOneCards({
  firstName,
  lastName,
  dob,
  state,
  email,
  phone,
  setFirstName,
  setLastName,
  setDob,
  setState,
  setEmail,
  setPhone,
}: {
  firstName: string;
  lastName: string;
  dob: string;
  state: string;
  email: string;
  phone: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setDob: (v: string) => void;
  setState: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
}) {
  return [
    {
      id: 0,
      name: "Step 1: Basics",
      designation: "Names",
      content: (
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
            />
          </div>
        </div>
      ),
    },
    {
      id: 1,
      name: "Step 1: Basics",
      designation: "DOB & State",
      content: (
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1">
            <Label htmlFor="dob">Date of birth</Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label>State of residence</Label>
            <Select value={state} onValueChange={(v) => setState(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state (WA, FL, GA, NE)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WA">Washington</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
                <SelectItem value="GA">Georgia</SelectItem>
                <SelectItem value="NE">Nebraska</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      name: "Step 1: Basics",
      designation: "Contact",
      content: (
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 555-5555"
            />
          </div>
        </div>
      ),
    },
  ];
}

function getStepTwoCards({
  heightCm,
  weightKg,
  energy,
  setHeightCm,
  setWeightKg,
  setEnergy,
  concerns,
  setConcerns,
  history,
  setHistory,
}: {
  heightCm: string;
  weightKg: string;
  energy: string;
  setHeightCm: (v: string) => void;
  setWeightKg: (v: string) => void;
  setEnergy: (v: string) => void;
  concerns: string[];
  setConcerns: (v: string[]) => void;
  history: { [k: string]: boolean };
  setHistory: (v: { [k: string]: boolean }) => void;
}) {
  const toggleConcern = (key: string, checked: boolean) => {
    if (checked) setConcerns([...concerns, key]);
    else setConcerns(concerns.filter((c) => c !== key));
  };

  return [
    {
      id: 3,
      name: "Step 2: Health Snapshot",
      designation: "Vitals",
      content: (
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1">
            <Label htmlFor="height">Height (inches)</Label>
            <Input
              id="height"
              inputMode="numeric"
              value={heightCm}
              onChange={(e) => setHeightCm(e.target.value)}
              placeholder="e.g., 71"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="weight">Weight (lbs)</Label>
            <Input
              id="weight"
              inputMode="numeric"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="e.g., 185"
            />
          </div>
        </div>
      ),
    },
    {
      id: 4,
      name: "Step 2: Health Snapshot",
      designation: "Energy",
      content: (
        <div className="space-y-2">
          <Label>Energy levels</Label>
          <RadioGroup value={energy} onValueChange={setEnergy} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="low" id="energy-low" />
              <Label htmlFor="energy-low">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="moderate" id="energy-moderate" />
              <Label htmlFor="energy-moderate">Moderate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="energy-high" />
              <Label htmlFor="energy-high">High</Label>
            </div>
          </RadioGroup>
        </div>
      ),
    },
    {
      id: 5,
      name: "Step 2: Health Snapshot",
      designation: "Concerns",
      content: (
        <div className="space-y-2">
          <Label>Main concerns (choose all that apply)</Label>
          <div className="grid grid-cols-1 gap-2">
            {[
              ["low-energy", "Low energy"],
              ["low-sex-drive", "Low sex drive / performance"],
              ["muscle", "Trouble building muscle"],
              ["fat-gain", "Fat gain / hard to lose fat"],
              ["hair-loss", "Hair loss"],
              ["sleep", "Sleep issues"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`concern-${key}`}
                  checked={concerns.includes(key)}
                  onCheckedChange={(v) => toggleConcern(key, Boolean(v))}
                />
                <Label htmlFor={`concern-${key}`}>{label}</Label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 6,
      name: "Step 2: Health Snapshot",
      designation: "History",
      content: (
        <div className="space-y-2">
          <Label>Medical history quick check</Label>
          <div className="grid grid-cols-1 gap-2">
            {[
              ["heartDisease", "Heart disease"],
              ["diabetes", "Uncontrolled diabetes"],
              ["cancer", "Cancer"],
              ["infection", "Active infection"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`history-${key}`}
                  checked={Boolean(history[key as keyof typeof history])}
                  onCheckedChange={(v) =>
                    setHistory({ ...history, [key]: Boolean(v) })
                  }
                />
                <Label htmlFor={`history-${key}`}>{label}</Label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];
}

function getStepThreeCards({
  service,
  setService,
}: {
  service: string[];
  setService: (v: string[]) => void;
}) {
  return [
    {
      id: 7,
      name: "Step 3: Service Alignment",
      designation: "Choose services",
      content: (
        <div className="space-y-2">
          <Label>What are you most interested in today?</Label>
          <div className="grid grid-cols-1 gap-2">
            {[
              ["trt", "Testosterone therapy"],
              ["ed", "Erectile function solutions"],
              ["hair", "Hair treatment"],
              ["coaching", "Coaching (fitness/nutrition/lifestyle)"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`svc-${key}`}
                  checked={service.includes(key)}
                  onCheckedChange={(v) =>
                    setService(
                      v ? [...service, key] : service.filter((s) => s !== key)
                    )
                  }
                />
                <Label htmlFor={`svc-${key}`}>{label}</Label>
              </div>
            ))}
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            TRT path triggers lab order; Coaching path goes to intake scheduling.
          </p>
        </div>
      ),
    },
  ];
}

function getStepFourCards({
  labLocation,
  setLabLocation,
  consent,
  setConsent,
}: {
  labLocation: string;
  setLabLocation: (v: string) => void;
  consent: boolean;
  setConsent: (v: boolean) => void;
}) {
  return [
    {
      id: 8,
      name: "Step 4: Labs & Payment",
      designation: "$100, all-in",
      content: (
        <div className="space-y-3">
          <p className="text-sm text-neutral-700 dark:text-neutral-200">
            One transparent charge of <span className="font-semibold">$100</span> covers your full lab panel and a
            FRAME physician review. If you’re a candidate, you’ll continue to your plan. If not, you’ll receive a
            personal note with next steps—no upsell.
          </p>
          <div className="space-y-1">
            <Label>Preferred lab location</Label>
            <Input
              placeholder="City or ZIP (for nearest lab)"
              value={labLocation}
              onChange={(e) => setLabLocation(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(v) => setConsent(Boolean(v))}
            />
            <Label htmlFor="consent">I agree to be charged $100 for labs & review</Label>
          </div>
        </div>
      ),
    },
  ];
}

function getStepFiveCards() {
  return [
    {
      id: 9,
      name: "Step 5: Confirmation",
      designation: "What happens next",
      content: (
        <div className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
          <ul className="list-disc list-inside space-y-1">
            <li>Download or email your lab order</li>
            <li>Complete your labs within 7 days</li>
            <li>A FRAME physician reviews your results</li>
            <li>Personalized recommendations within 3–5 business days</li>
            <li>Questions? Use click‑to‑call or reply to our support email</li>
          </ul>
        </div>
      ),
    },
  ];
}


