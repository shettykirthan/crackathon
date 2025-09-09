"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card1"
import { Button } from "@/components/ui/button1"
import { Input } from "@/components/ui/input1"
import { Label } from "@/components/ui/label1"
import { Textarea } from "@/components/ui/textarea1"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs1"
import {
  ArrowLeftIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react"

interface HRViewProps {
  onBack: () => void
}

export default function HRView({ onBack }: HRViewProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [jobs, setJobs] = useState<any[]>([])
  const [applicants, setApplicants] = useState<any[]>([])
  const [selectedJob, setSelectedJob] = useState<string | null>(null)

  const [newJob, setNewJob] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    skills: "",
  })

  // ---------------- Dummy Applicants ----------------
  const dummyApplicants = [
    { _id: "1", name: "Alice Johnson", email: "alice@example.com", resumeUrl: "#", score: Math.floor(Math.random() * 51) + 50, videoUrl: "#" },
    { _id: "2", name: "Bob Smith", email: "bob@example.com", resumeUrl: "#", score: Math.floor(Math.random() * 51) + 50, videoUrl: "#" },
    { _id: "3", name: "Charlie Lee", email: "charlie@example.com", resumeUrl: "#", score: Math.floor(Math.random() * 51) + 50, videoUrl: "#" },
  ]

  // Fetch jobs
  useEffect(() => {
    fetch("http://localhost:5001/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => {
        console.error("Error fetching jobs:", err)
        // Fallback dummy jobs if backend fails
        setJobs([
          { _id: "1", title: "Frontend Developer", location: "Remote", createdAt: new Date().toISOString(), status: "Active" },
          { _id: "2", title: "Backend Engineer", location: "NYC", createdAt: new Date().toISOString(), status: "Active" },
        ])
      })
  }, [activeTab])

  const handleJobClick = async (jobId: string) => {
    setSelectedJob(jobId)
    setActiveTab("applicants")
    try {
      const res = await fetch(`http://localhost:5001/api/jobs/${jobId}/applicants`)
      let data = await res.json()
      // Assign dummy scores if missing
      data = data.map((app: any) => ({ ...app, score: app.score ?? Math.floor(Math.random() * 51) + 50 }))
      // If empty, use dummyApplicants
      if (data.length === 0) data = dummyApplicants
      setApplicants(data)
    } catch (err) {
      console.error("Error fetching applicants:", err)
      setApplicants(dummyApplicants)
    }
  }

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:5001/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJob),
      })
      if (res.ok) {
        alert("Job created successfully!")
        setActiveTab("dashboard")
      }
    } catch (err) {
      console.error("Error creating job:", err)
    }
  }

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="flex items-center mb-8">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold">HR Dashboard</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboardIcon className="h-4 w-4" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="create" className="flex items-center gap-2">
            <PlusCircleIcon className="h-4 w-4" /> Create Job
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 gap-6">
              {jobs.map((job) => (
                <Card
                  key={job._id}
                  className="cursor-pointer hover:border-orange-300 transition-all"
                  onClick={() => handleJobClick(job._id)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        <p className="text-gray-600">{job.location}</p>
                      </div>
                      <div className="flex gap-4 items-center">
                        <span className="text-sm">{new Date(job.createdAt).toDateString()}</span>
                        {job.status === "Active" ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircleIcon className="h-4 w-4" /> Active
                          </span>
                        ) : (
                          <span className="text-red-600 flex items-center gap-1">
                            <XCircleIcon className="h-4 w-4" /> Closed
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Create New Job Listing</CardTitle>
                <CardDescription>Fill out the form below to create a new job listing</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateJob} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input id="title" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea id="description" value={newJob.description} onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary</Label>
                      <Input id="salary" value={newJob.salary} onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input id="skills" value={newJob.skills} onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })} />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setActiveTab("dashboard")}>Cancel</Button>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">Create Job</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applicants">
            <div className="space-y-4">
              <Button variant="ghost" onClick={() => setActiveTab("dashboard")}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" /> Back to Jobs
              </Button>
              {applicants.map((app) => (
                <Card key={app._id}>
                  <CardContent className="p-4 flex justify-between">
                    <div>
                      <h4 className="font-bold">{app.name}</h4>
                      <p>{app.email}</p>
                      <a href={app.resumeUrl} target="_blank" className="text-orange-500">View Resume</a>
                    </div>
                    <div>
                      <p>Score: {app.score}%</p>
                      {app.videoUrl && (
                        <Button size="sm" onClick={() => window.open(app.videoUrl, "_blank")}>View Interview</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}
