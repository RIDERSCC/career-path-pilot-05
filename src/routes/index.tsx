import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { extractTextFromPDF } from "../utils/pdfExtractor";
import { useEffect } from "react";
import {
  Sparkles,
  UploadCloud,
  FileText,
  Briefcase,
  MapPin,
  Building2,
  Globe2,
  TrendingUp,
  Target,
  GraduationCap,
  MessageSquare,
  Mic,
  Copy,
  Check,
  ArrowRight,
  Loader2,
  X,
  Zap,
  Award,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  mockResumeAnalysis,
  mockJobs,
  mockSkillGaps,
  mockCoverLetter,
  mockInterview,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerPilot AI — Your AI Career Copilot" },
      { name: "description", content: "Upload your resume to discover matching jobs, identify skill gaps, generate cover letters, and prepare for interviews." },
      { property: "og:title", content: "CareerPilot AI" },
      { property: "og:description", content: "AI-powered career assistant for resume analysis, job matches, and interview prep." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const analysisRef = useRef<HTMLDivElement | null>(null);

  const handleAnalyze = useCallback(async () => {
  if (!file) {
    alert("Please upload a resume.");
    return;
  }

  try {
    setAnalyzing(true);

    // Extract text from PDF
    const resumeText = await extractTextFromPDF(file);

    console.log("Extracted Resume Text:");
    console.log(resumeText);

    // Send to n8n
    const response = await fetch(
      "http://localhost:5678/webhook-test/resume-analysis",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeText,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to analyze resume");
    }

    const responseData = await response.json();

    console.log(responseData);

    // Merge AI analysis + real jobs
    const result = {
      ...responseData.analysis,
      recommended_jobs: responseData.recommended_jobs,
    };

    setAnalysis(result);

    console.log(result);

    console.log("Gemini Response:");
    

    // We'll connect this data to UI next
    setAnalyzed(true);

    requestAnimationFrame(() => {
      analysisRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

  } catch (err) {
    console.error(err);
    alert("Resume analysis failed.");
  } finally {
    setAnalyzing(false);
  }
}, [file]);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <Hero onCtaClick={() => document.getElementById("upload")?.scrollIntoView({ behavior: "smooth" })} />

      <main className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <section id="upload" className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ResumeUploadCard
              file={file}
              setFile={setFile}
              onAnalyze={handleAnalyze}
              analyzing={analyzing}
            />
          </div>
          <div className="lg:col-span-2">
            <JobPreferencesCard />
          </div>
        </section>

        <div ref={analysisRef} className="scroll-mt-24" />

        {!analyzed ? (
          <EmptyAnalysisState />
        ) : (
          <>
            <SectionHeading
              eyebrow="Step 02"
              title="Resume Analysis"
              description="What we extracted from your resume in seconds."
              icon={<Sparkles className="h-4 w-4" />}
            />
            <ResumeAnalysis data={analysis} />

            <SectionHeading
              eyebrow="Step 03"
              title="Recommended Jobs"
              description="Roles ranked by how well they fit your profile."
              icon={<Briefcase className="h-4 w-4" />}
            />
            <RecommendedJobs data={analysis} />

            <SectionHeading
              eyebrow="Step 04"
              title="Skill Gap Analysis"
              description="Close the distance between you and your next role."
              icon={<Target className="h-4 w-4" />}
            />
            <SkillGap data={analysis} />

            <SectionHeading
              eyebrow="Step 05"
              title="Cover Letter Preview"
              description="A tailored draft you can edit and send."
              icon={<MessageSquare className="h-4 w-4" />}
            />
            <CoverLetter data={analysis} />

            <SectionHeading
              eyebrow="Step 06"
              title="Interview Preparation"
              description="Practice questions calibrated to your target roles."
              icon={<Mic className="h-4 w-4" />}
            />
            <InterviewPrep data={analysis} />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ─────────────────────────────  Nav + Hero  ───────────────────────────── */

function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight">CareerPilot AI</span>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#upload" className="hover:text-foreground">Upload</a>
          <a href="#jobs" className="hover:text-foreground">Jobs</a>
          <a href="#skills" className="hover:text-foreground">Skills</a>
          <a href="#interview" className="hover:text-foreground">Interview</a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-16 sm:px-6 sm:pt-20 lg:px-8 lg:pb-20 lg:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-5 rounded-full border border-border/60 px-3 py-1 text-xs font-medium">
            <Zap className="mr-1 h-3 w-3 text-primary" /> AI-powered career intelligence
          </Badge>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            CareerPilot{" "}
            <span className="bg-[var(--gradient-primary)] bg-clip-text text-transparent">AI</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Upload your resume and discover AI-powered career opportunities instantly. Get matched roles, skill gaps, tailored cover letters, and interview prep — in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              onClick={onCtaClick}
              className="bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)] hover:opacity-95"
            >
              Analyze Resume
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              See how it works
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-display text-base font-bold text-foreground">{value}</span>
      <span>{label}</span>
    </div>
  );
}

/* ─────────────────────────────  Upload + Prefs  ───────────────────────────── */

function ResumeUploadCard({
  file,
  setFile,
  onAnalyze,
  analyzing,
}: {
  file: File | null;
  setFile: (f: File | null) => void;
  onAnalyze: () => void;
  analyzing: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  return (
    <Card className="overflow-hidden border-border/70 shadow-[var(--shadow-soft)]">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <UploadCloud className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">Upload your resume</CardTitle>
            <CardDescription>PDF only · up to 5MB</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed bg-muted/30 px-6 py-12 text-center transition-all",
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/60 hover:bg-muted/50",
          )}
        >
          <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-elegant)]">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Drag & drop your PDF here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              or click to browse from your device
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
            }}
          />
        </div>

        {file && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB · Ready to analyze
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="flex-1 sm:flex-none"
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Choose file
          </Button>
          <Button
            onClick={onAnalyze}
            disabled={!file || analyzing}
            className="flex-1 bg-[var(--gradient-primary)] text-primary-foreground hover:opacity-95 sm:flex-none"
          >
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function JobPreferencesCard() {
  return (
    <Card className="border-border/70 shadow-[var(--shadow-soft)]">
  <CardHeader>
    <CardTitle>Job Search</CardTitle>

    <CardDescription>
      Personalized recommendations powered by AI
    </CardDescription>
  </CardHeader>

  <CardContent>
    <div className="rounded-xl bg-primary/5 border border-primary/20 p-5 text-center">

      <h3 className="font-semibold text-lg">
         Searching jobs across India
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        CareerPilot AI matches your resume with the latest opportunities
        across India and recommends the best-fit roles automatically.
      </p>

    </div>
  </CardContent>
</Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function WorkTypeChip({ label, defaultActive }: { label: string; defaultActive?: boolean }) {
  const [active, setActive] = useState(!!defaultActive);
  return (
    <button
      type="button"
      onClick={() => setActive((a) => !a)}
      className={cn(
        "rounded-md border px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

/* ─────────────────────────────  Sections  ───────────────────────────── */

function SectionHeading({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="mt-14 mb-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
        {icon}
        <span>{eyebrow}</span>
      </div>
      <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function EmptyAnalysisState() {
  return (
    <Card className="mt-12 border-dashed border-border/80 bg-muted/20">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <BarChart3 className="h-5 w-5" />
        </div>
        <h3 className="font-display text-lg font-semibold">Your analysis will appear here</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Upload a resume and hit <span className="font-medium text-foreground">Analyze</span> to unlock job matches, skill gaps, a cover letter, and interview prep.
        </p>
      </CardContent>
    </Card>
  );
}

function ResumeAnalysis({ data }: { data: any }) {
  const a = {
  currentRole: data?.current_role || "Not Available",
  yearsExperience: data?.experience_years || 0,
  topSkills: data?.skills || [],
  preferredRoles: data?.preferred_roles || [],
  };
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        icon={<Briefcase className="h-4 w-4" />}
        label="Current role"
        value={a.currentRole}
      />
      <StatCard
        icon={<TrendingUp className="h-4 w-4" />}
        label="Years of experience"
        value={`${a.yearsExperience} years`}
      />
      <Card className="border-border/70 shadow-[var(--shadow-soft)]">
        <CardContent className="space-y-2 p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Award className="h-4 w-4" /> Top skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {a.topSkills.map((s) => (
              <Badge key={s} variant="secondary" className="rounded-md font-medium">{s}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="border-border/70 shadow-[var(--shadow-soft)]">
        <CardContent className="space-y-2 p-5">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Target className="h-4 w-4" /> Preferred roles
          </div>
          <ul className="space-y-1 text-sm font-medium text-foreground">
            {a.preferredRoles.map((r) => (
              <li key={r} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {r}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <Card className="border-border/70 shadow-[var(--shadow-soft)]">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          {icon} {label}
        </div>
        <p className="mt-2 font-display text-lg font-bold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}

function RecommendedJobs({ data }: { data: any }) {
  const jobs = data?.recommended_jobs || [];
  return (
    <Card id="jobs" className="overflow-hidden border-border/70 shadow-[var(--shadow-soft)]">
      <div className="hidden grid-cols-12 gap-4 border-b border-border bg-muted/40 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:grid">
        <div className="col-span-4">Role</div>
        <div className="col-span-3">Company · Location</div>
        <div className="col-span-2">Salary</div>
        <div className="col-span-2">Match</div>
        <div className="col-span-1 text-right">Action</div>
      </div>
      <ul className="divide-y divide-border">
        {jobs.map((job: any, index: number) => (
          <li
            key={index}
            className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/30 md:grid-cols-12 md:items-center md:gap-4"
          >
            <div className="md:col-span-4">
              <div className="flex items-start gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{job.title}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {job.reason && (
                      <Badge variant="secondary" className="rounded-md">
                        {job.reason}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {job.company}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {job.location}
              </div>
            </div>
            <div className="text-sm font-medium text-foreground md:col-span-2">Not Available</div>
            <div className="md:col-span-2">
              <MatchScore score={job.match_score} />
            </div>
            <div className="md:col-span-1 md:text-right">
              <Button
              size="sm"
              className="bg-[var(--gradient-primary)] text-primary-foreground hover:opacity-95"
              asChild
            >
              <a
                href={job.apply_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Apply
              </a>
            </Button>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function MatchScore({ score }: { score: number }) {
  const tone =
    score >= 90 ? "text-success" : score >= 80 ? "text-primary" : "text-warning";
  const bar =
    score >= 90 ? "bg-success" : score >= 80 ? "bg-primary" : "bg-warning";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className={cn("font-display text-sm font-bold", tone)}>{score}%</span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">match</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", bar)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function SkillGap({ data }: { data: any }) {
  const gap = data?.skill_gap || {
  missing_skills: [],
  recommended_courses: [],
};
  return (
    <div id="skills" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card className="border-border/70 shadow-[var(--shadow-soft)]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-destructive/10 text-destructive">
              <X className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">Missing skills</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {gap.missing_skills.map((s: string) => (
              <Badge key={s} className="rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-[var(--shadow-soft)]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-success/10 text-success">
              <GraduationCap className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">Recommended skills</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {gap.recommended_courses.map((s: string) => (
              <Badge key={s} className="rounded-md bg-success/10 text-success hover:bg-success/20">
                {s}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 shadow-[var(--shadow-soft)]">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>
            <CardTitle className="text-base">Learning priority</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
  <p className="text-sm text-muted-foreground">
    Learning priorities will be generated in the next version.
  </p>
</CardContent>
      </Card>
    </div>
  );
}

function CoverLetter({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);
  const [value, setValue] = useState(data?.cover_letter || "");
  useEffect(() => {
  setValue(data?.cover_letter || "");
}, [data]);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Card className="border-border/70 shadow-[var(--shadow-soft)]">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className="min-w-0">
          <CardTitle className="text-base">Tailored for Linear — Staff Frontend Engineer</CardTitle>
          <CardDescription>Generated from your resume and the role description.</CardDescription>
        </div>
        <Button size="sm" variant="outline" onClick={copy} className="shrink-0">
          {copied ? <Check className="mr-2 h-4 w-4 text-success" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[280px] resize-none bg-muted/30 font-sans text-sm leading-relaxed"
        />
      </CardContent>
    </Card>
  );
}

function InterviewPrep({ data }: { data: any }) {
  const questions = data?.interview_questions || [];

  return (
    <Card
      id="interview"
      className="border-border/70 shadow-[var(--shadow-soft)]"
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Interview Preparation</CardTitle>
        <CardDescription>
          AI-generated interview questions based on your resume.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <QuestionList items={questions} />
      </CardContent>
    </Card>
  );
}

function QuestionList({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((q, i) => (
        <li
          key={q}
          className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-muted/30"
        >
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-xs font-semibold text-primary">
            {i + 1}
          </span>
          <p className="min-w-0 flex-1 text-sm text-foreground">{q}</p>
          <Button
            size="sm"
            variant="ghost"
            className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
          >
            Practice
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </li>
      ))}
    </ol>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} CareerPilot AI. Built for ambitious careers.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
