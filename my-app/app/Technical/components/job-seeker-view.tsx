"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card1"
import { Button } from "@/components/ui/button1"
import { Input } from "@/components/ui/input1"
import { Label } from "@/components/ui/label1"
import { ArrowLeftIcon, UploadIcon, CheckIcon, PlayIcon, MonitorStopIcon as StopIcon, CheckCircleIcon } from "lucide-react"

interface Job {
  id: number
  title: string
  company: string
  description: string
  skills: string
  location: string
  salary: string
}

const jobListings: Job[] = [
  { id: 1, title: "Frontend Developer", company: "Tech Corp", description: "Build amazing UI", skills: "React, TS", location: "Remote", salary: "$4000" },
  { id: 2, title: "Backend Developer", company: "Data Systems", description: "Handle API & DB", skills: "Node.js, MongoDB", location: "NYC", salary: "$4500" },
  { id: 3, title: "UI/UX Designer", company: "Creative Minds", description: "Design awesome interfaces", skills: "Figma, Adobe XD", location: "Remote", salary: "$3500" },
]

// ---------------- VideoRecorder Component ----------------
function VideoRecorder({ onVideoRecorded }: { onVideoRecorded: (blob: Blob) => void }) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingComplete, setRecordingComplete] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    const initCamera = async () => {
      try {
        const videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        setStream(videoStream)
        if (videoRef.current) videoRef.current.srcObject = videoStream
      } catch (err) {
        console.error("Error accessing camera:", err)
      }
    }
    initCamera()
    return () => {
      stream?.getTracks().forEach((track) => track.stop())
    }
  }, [])

  const startRecording = () => {
    if (!stream) return
    chunksRef.current = []
    const recorder = new MediaRecorder(stream)
    mediaRecorderRef.current = recorder
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/mp4" })
      onVideoRecorded(blob)
      setRecordingComplete(true)
    }
    recorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-200 rounded-lg overflow-hidden aspect-video relative">
        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
        {isRecording && <div className="absolute top-2 left-2 text-red-500 font-bold">Recording...</div>}
        {recordingComplete && !isRecording && <div className="absolute inset-0 flex items-center justify-center"><CheckCircleIcon className="h-12 w-12 text-green-500" /></div>}
      </div>
      <div className="flex justify-center gap-4">
        {!isRecording ? (
          <Button onClick={startRecording} className="bg-green-500 text-white"><PlayIcon className="mr-2" />Start Recording</Button>
        ) : (
          <Button onClick={stopRecording} className="bg-red-500 text-white"><StopIcon className="mr-2" />Stop Recording</Button>
        )}
      </div>
    </div>
  )
}

// ---------------- JobSeekerView Component ----------------
export default function JobSeekerView({ onBack }: { onBack: () => void }) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showInterview, setShowInterview] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", resume: null as File | null, score: 0, videos: [] as Blob[] })
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const interviewQuestions = [
    "Tell us about yourself.",
    "What are your strengths?",
    "Describe a challenge you overcame.",
    "Why do you want this role?",
    "Any questions for us?",
  ]

  const handleApplyClick = (job: Job) => {
    setSelectedJob(job)
    setShowForm(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.resume) return alert("Upload resume first")
    // Skip backend, just go to interview
    setShowForm(false)
    setShowInterview(true)
  }

  const handleNextQuestion = () => {
    // Add 20 points for each question answered
    setFormData({ ...formData, score: formData.score + 20 })
    if (currentQuestion < interviewQuestions.length - 1) setCurrentQuestion(currentQuestion + 1)
    else {
      alert(`Interview complete! Score: ${formData.score + 20}/100`)
      onBack()
    }
  }

  const handleVideoRecorded = (blob: Blob) => {
    setFormData({ ...formData, videos: [...formData.videos, blob] })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFormData({ ...formData, resume: e.target.files[0] })
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={onBack} className="mr-4"><ArrowLeftIcon className="h-4 w-4 mr-2" />Back</Button>
        <h2 className="text-2xl font-bold">Job Opportunities</h2>
      </div>

      <AnimatePresence mode="wait">
        {!showForm && !showInterview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobListings.map((job) => (
              <motion.div key={job.id} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>{job.title}</CardTitle>
                    <CardDescription>{job.company}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p>{job.description}</p>
                    <p><strong>Skills:</strong> {job.skills}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Salary:</strong> {job.salary}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-orange-500 text-white" onClick={() => handleApplyClick(job)}>Apply Now</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {showForm && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Apply for {selectedJob?.title}</CardTitle>
                <CardDescription>Fill out the form below</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Resume</Label>
                    <Input type="file" onChange={handleFileChange} required />
                  </div>
                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button type="submit" className="bg-orange-500 text-white">Submit & Start Interview</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {showInterview && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <Card className="max-w-4xl mx-auto p-4 bg-white bg-opacity-90 shadow-lg">
              <CardHeader>
                <CardTitle>Interview Question {currentQuestion + 1}/{interviewQuestions.length}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-medium">{interviewQuestions[currentQuestion]}</p>
                <VideoRecorder onVideoRecorded={handleVideoRecorded} />
                <div className="flex justify-end mt-4">
                  <Button className="bg-orange-500 text-white" onClick={handleNextQuestion}>
                    {currentQuestion < interviewQuestions.length - 1 ? "Next Question" : "Finish Interview"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
