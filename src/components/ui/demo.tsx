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
  // Step 4 state (Intake scheduling)
  const [scheduleDate, setScheduleDate] = useState(""); // repurposed as best time to contact
  const [contactMethod, setContactMethod] = useState("");

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
      scheduleDate,
      setScheduleDate,
      contactMethod,
      setContactMethod,
    })
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
        return dob.trim().length > 0 && ["Washington","Florida","Georgia","Nebraska","North Carolina"].includes(state);
      case 2:
        return email.trim().length > 0 && phone.trim().length > 0;
      case 3:
        return heightCm.trim().length > 0 && weightKg.trim().length > 0;
      case 4:
        return ["low","moderate","high"].includes(energy);
      case 5:
        return concerns.length > 0; // pick at least one
      case 6:
        return Object.values(history).some(Boolean); // pick at least one
      case 7:
        return service.length > 0; // pick at least one
      case 8:
        return ["morning","afternoon","evening"].includes(scheduleDate) && ["call","text","email"].includes(contactMethod);
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
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const resetAll = () => {
    setFirstName("");
    setLastName("");
    setDob("");
    setState("");
    setEmail("");
    setPhone("");
    setHeightCm("");
    setWeightKg("");
    setEnergy("moderate");
    setConcerns([]);
    setHistory({ heartDisease: false, diabetes: false, cancer: false, infection: false });
    setService([]);
    setScheduleDate("");
    setContactMethod("");
    setCurrent(0);
    setSubmitted(false);
    setSubmitError(false);
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const HISTORY_LABELS: Record<string, string> = {
        heartDisease: "Heart disease",
        diabetes: "Uncontrolled diabetes",
        cancer: "Cancer",
        infection: "Active infection",
      };
      const SERVICE_LABELS: Record<string, string> = {
        trt: "Testosterone therapy",
        ed: "Erectile function solutions",
        hair: "Hair treatment",
        coaching: "Coaching (fitness/nutrition/lifestyle)",
      };

      const historySelectedLabels = Object.entries(history)
        .filter(([, v]) => Boolean(v))
        .map(([k]) => HISTORY_LABELS[k] || k);
      const servicesLabels = service.map((k) => SERVICE_LABELS[k] || k);

      const payload = {
        firstName,
        lastName,
        dob,
        state,
        email,
        phone,
        heightInches: heightCm,
        weightLbs: weightKg,
        energy,
        concerns,
        history: historySelectedLabels.join(", "),
        services: servicesLabels.join(", "),
        scheduleDate,
        contactMethod,
      };
      // Always hit same-origin serverless proxy to avoid browser CORS in prod
      const res = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Bad status: ${res.status}`);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    const successItems = [
      {
        id: 999,
        name: "",
        designation: "",
        content: (
          <div className="flex items-center justify-center h-full min-h-60 text-center">
            <div className="space-y-3">
              <svg className="h-16 w-16 mx-auto text-brand-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5">
                  <animate attributeName="stroke-dasharray" from="0,40" to="40,0" dur="0.6s" fill="freeze" />
                </path>
              </svg>
              <h2 className="text-xl font-semibold">Thank you for choosing FRAME Medicine.</h2>
              <p className="text-sm text-muted-foreground">We'll reach out soon!</p>
            </div>
          </div>
        ),
      },
    ];
    return (
      <div className="h-[40rem] flex flex-col items-center justify-center w-full gap-6">
        <CardStack items={successItems} manual current={0} maxVisible={1} />
        <div className="flex items-center gap-6 mt-10">
          <button
            type="button"
            onClick={resetAll}
            className="px-5 py-2.5 rounded-xl bg-brand text-white hover:opacity-90"
          >
            Retake Quiz
          </button>
        </div>
        {submitError && (
          <p className="text-xs text-destructive mt-2">Submission failed. Check your network & try again.</p>
        )}
      </div>
    );
  }

  return (
    <div className="h-[40rem] flex flex-col items-center justify-center w-full gap-6">
      <CardStack items={items} manual current={current} maxVisible={4} />
      <div className="flex items-center gap-6 mt-10">
        {!isFirst && (
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
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-5 py-2.5 rounded-xl text-white hover:opacity-90 ${submitting ? 'bg-muted cursor-not-allowed' : 'bg-brand'}`}
          >
            {submitting ? 'Submitting…' : 'Submit'}
          </button>
        )}
      </div>
      {!isValid && triedNext && (
        <p className="text-xs text-destructive mt-2">
          Please complete the required fields before continuing.
        </p>
      )}
      {submitError && (
        <p className="text-xs text-destructive mt-2">Submission failed. Check your network connection & try again.</p>
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
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Washington">Washington</SelectItem>
                <SelectItem value="Florida">Florida</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Nebraska">Nebraska</SelectItem>
                <SelectItem value="North Carolina">North Carolina</SelectItem>
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
        </div>
      ),
    },
  ];
}

function getStepFourCards({
  scheduleDate,
  setScheduleDate,
  contactMethod,
  setContactMethod,
}: {
  scheduleDate: string;
  setScheduleDate: (v: string) => void;
  contactMethod: string;
  setContactMethod: (v: string) => void;
}) {
  return [
    {
      id: 8,
      name: "Step 4: Get Started",
      designation: "",
      content: (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label>Best time to contact</Label>
            <Select value={scheduleDate} onValueChange={setScheduleDate}>
              <SelectTrigger>
                <SelectValue placeholder="Select: Morning, Afternoon, Evening" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="afternoon">Afternoon</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Preferred contact</Label>
            <Select value={contactMethod} onValueChange={setContactMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select: Call, Text, Email" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            We’ll reach out to confirm your intake and next steps.
          </p>
        </div>
      ),
    },
  ];
}

// Step 5 removed per latest requirements
