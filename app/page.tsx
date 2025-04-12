"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

// Class definitions with their specs - updated to ensure all have specializations
const classOptions = [
  { value: "dk_blood", spec: "Blood", icon: "/icons/deathknight/blood.png?height=20&width=20", color: "#C41E3A" },
  { value: "dk_unholy", spec: "Unholy", icon: "/icons/deathknight/unholy.png?height=20&width=20", color: "#C41E3A" },
  { value: "dk_frost", spec: "Frost", icon: "/icons/deathknight/frost.png?height=20&width=20", color: "#C41E3A" },
  {
    value: "hunter_mark",
    spec: "Marksman",
    icon: "/icons/hunter/marksman.png?height=20&width=20",
    color: "#ABD473",
  },
  {
    value: "hunter_surv",
    spec: "Survival",
    icon: "/icons/hunter/survival.png?height=20&width=20",
    color: "#ABD473",
  },
  {
    value: "hunter_bm",
    spec: "Beastmaster",
    icon: "/icons/hunter/beastmastery.png?height=20&width=20",
    color: "#ABD473",
  },
  {
    value: "warrior_prot",
    spec: "Protection",
    icon: "/icons/warrior/protection.png?height=20&width=20",
    color: "#C79C6E",
  },
  { value: "warrior_arms", spec: "Arms", icon: "/icons/warrior/arms.png?height=20&width=20", color: "#C79C6E" },
  { value: "warrior_fury", spec: "Fury", icon: "/icons/warrior/fury.png?height=20&width=20", color: "#C79C6E" },
  {
    value: "rogue_assa",
    spec: "Assassin",
    icon: "/icons/rogue/assassination.png?height=20&width=20",
    color: "#FFF569",
  },
  { value: "rogue_sub", spec: "Subtlety", icon: "/icons/rogue/subtlety.png?height=20&width=20", color: "#FFF569" },
  { value: "rogue_combat", spec: "Combat", icon: "/icons/rogue/combat.png?height=20&width=20", color: "#FFF569" },
  {
    value: "shaman_resto",
    spec: "Restoration",
    icon: "/icons/shaman/restoration.png?height=20&width=20",
    color: "#0070DE",
  },
  {
    value: "shaman_enha",
    spec: "Enhancement",
    icon: "/icons/shaman/enhancement.png?height=20&width=20",
    color: "#0070DE",
  },
  {
    value: "shaman_ele",
    spec: "Elemental",
    icon: "/icons/shaman/elemental.png?height=20&width=20",
    color: "#0070DE",
  },
  { value: "mage_arcane", spec: "Arcane", icon: "/icons/mage/arcane.png?height=20&width=20", color: "#69CCF0" },
  { value: "mage_fire", spec: "Fire", icon: "/icons/mage/fire.png?height=20&width=20", color: "#69CCF0" },
  { value: "mage_frost", spec: "Frost", icon: "/icons/mage/frost.png?height=20&width=20", color: "#69CCF0" },
  {
    value: "druid_resto",
    spec: "Restoration",
    icon: "/icons/druid/restoration.png?height=20&width=20",
    color: "#FF7D0A",
  },
  { value: "druid_feral", spec: "Feral", icon: "/icons/druid/feral.png?height=20&width=20", color: "#FF7D0A" },
  { value: "druid_bala", spec: "Balance", icon: "/icons/druid/balance.png?height=20&width=20", color: "#FF7D0A" },
  { value: "monk_mist", spec: "Mistweaver", icon: "/icons/monk/mistweaver.png?height=20&width=20", color: "#00FF96" },
  { value: "monk_brew", spec: "Brewmaster", icon: "/icons/monk/brewmaster.png?height=20&width=20", color: "#00FF96" },
  { value: "monk_ww", spec: "Windwalker", icon: "/icons/monk/windwalker.png?height=20&width=20", color: "#00FF96" },
  { value: "priest_holy", spec: "Holy", icon: "/icons/priest/holy.png?height=20&width=20", color: "#FFFFFF" },
  { value: "priest_sh", spec: "Shadow", icon: "/icons/priest/shadow.png?height=20&width=20", color: "#FFFFFF" },
  {
    value: "priest_disc",
    spec: "Discipline",
    icon: "/icons/priest/discipline.png?height=20&width=20",
    color: "#FFFFFF",
  },
  {
    value: "warlock_affli",
    spec: "Affliction",
    icon: "/icons/warlock/affliction.png?height=20&width=20",
    color: "#9482C9",
  },
  {
    value: "warlock_destro",
    spec: "Destruction",
    icon: "/icons/warlock/destruction.png?height=20&width=20",
    color: "#9482C9",
  },
  {
    value: "warlock_demo",
    spec: "Demonology",
    icon: "/icons/warlock/demonology.png?height=20&width=20",
    color: "#9482C9",
  },
  { value: "paladin_holy", spec: "Holy", icon: "/icons/paladin/holy.png?height=20&width=20", color: "#F58CBA" },
  {
    value: "paladin_ret",
    spec: "Retribution",
    icon: "/icons/paladin/retribution.png?height=20&width=20",
    color: "#F58CBA",
  },
  {
    value: "paladin_prot",
    spec: "Protection",
    icon: "/icons/paladin/protection.png?height=20&width=20",
    color: "#F58CBA",
  },
]

// Group classes by their base class
const groupedClasses = {
  "Death Knight": ["dk_blood", "dk_unholy", "dk_frost"],
  Hunter: ["hunter_mark", "hunter_surv", "hunter_bm"],
  Warrior: ["warrior_prot", "warrior_arms", "warrior_fury"],
  Rogue: ["rogue_assa", "rogue_sub", "rogue_combat"],
  Shaman: ["shaman_resto", "shaman_enha", "shaman_ele"],
  Mage: ["mage_fire", "mage_frost", "mage_arcane"],
  Druid: ["druid_resto", "druid_feral", "druid_bala"],
  Monk: ["monk_mist", "monk_brew", "monk_ww"],
  Priest: ["priest_holy", "priest_sh", "priest_disc"],
  Warlock: ["warlock_affli", "warlock_destro", "warlock_demo"],
  Paladin: ["paladin_holy", "paladin_ret", "paladin_prot"],
}

// Type for buff data returned from API
type BuffData = {
  [category: string]: { [buff: string]: number }
}

export default function RaidSetupCalculator() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Initialize state with 10 empty slots
  const [raidSetup, setRaidSetup] = useState<(string | null)[]>(Array(10).fill(null))
  const [draggedClass, setDraggedClass] = useState<string | null>(null)
  const [buffData, setBuffData] = useState<BuffData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string>("")

  // Load raid setup from URL on initial load
  useEffect(() => {
    const composition = searchParams.get("comp")
    if (composition) {
      try {
        const decodedComp = atob(composition)
        const parsedComp = JSON.parse(decodedComp) as (string | null)[]

        // Validate the composition
        if (Array.isArray(parsedComp) && parsedComp.length === 10) {
          const validComp = parsedComp.map((item) => {
            if (item === null) return null
            return classOptions.some((c) => c.value === item) ? item : null
          })

          setRaidSetup(validComp)
          // Automatically analyze the composition
          analyzeRaidComposition(validComp)
        }
      } catch (e) {
        console.error("Failed to parse composition from URL", e)
      }
    }
  }, [searchParams])

  // Update URL when raid setup changes
  useEffect(() => {
    // Only update if there's at least one class in the raid
    if (raidSetup.some(Boolean)) {
      const compStr = JSON.stringify(raidSetup)
      const encodedComp = btoa(compStr)
      const url = `${window.location.pathname}?comp=${encodedComp}`

      // Update browser URL without reload
      window.history.replaceState({}, "", url)

      // Update share URL
      setShareUrl(`${window.location.origin}${url}`)
    } else {
      // Clear URL params if raid is empty
      window.history.replaceState({}, "", window.location.pathname)
      setShareUrl("")
    }
  }, [raidSetup])

  // Function to handle drag start
  const handleDragStart = (e: React.DragEvent, classValue: string) => {
    setDraggedClass(classValue)
    e.dataTransfer.setData("text/plain", classValue)
    e.dataTransfer.effectAllowed = "move"
  }

  // Function to handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  // Function to handle drop on a raid slot
  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedClass) {
      // Check if we're moving from another slot
      const currentIndex = raidSetup.indexOf(draggedClass)

      const newSetup = [...raidSetup]

      // If moving from another slot, clear that slot only if it's the same instance
      // (identified by the slot-index data)
      const slotIndex = e.dataTransfer.getData("slot-index")
      if (slotIndex && Number.parseInt(slotIndex) === currentIndex) {
        newSetup[currentIndex] = null
      }

      // Set the new slot
      newSetup[index] = draggedClass
      setRaidSetup(newSetup)
      setDraggedClass(null)
    }
  }

  // Function to handle drop on the class palette (removing from raid)
  const handleRemoveDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (draggedClass) {
      const slotIndex = e.dataTransfer.getData("slot-index")
      if (slotIndex) {
        const index = Number.parseInt(slotIndex)
        const newSetup = [...raidSetup]
        newSetup[index] = null
        setRaidSetup(newSetup)
      }
      setDraggedClass(null)
    }
  }

  // Function to reset the raid setup
  const resetSetup = () => {
    setRaidSetup(Array(10).fill(null))
    setBuffData(null)
    setError(null)
    setShareUrl("")
  }

  // Function to copy share URL to clipboard
  const copyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => {
          alert("Share URL copied to clipboard!")
        })
        .catch((err) => {
          console.error("Failed to copy URL: ", err)
        })
    }
  }

  // Get class details by value
  const getClassDetails = (value: string) => {
    return (
      classOptions.find((option) => option.value === value) || {
        value: "",
        label: "Empty",
        spec: "",
        icon: "",
        color: "#666",
      }
    )
  }

  // Function to handle dragging a class from a raid slot
  const handleRaidSlotDragStart = (e: React.DragEvent, classValue: string, index: number) => {
    setDraggedClass(classValue)
    e.dataTransfer.setData("text/plain", classValue)
    e.dataTransfer.setData("slot-index", index.toString())
    e.dataTransfer.effectAllowed = "move"
  }

  // Count occurrences of each class in the raid
  const getClassCount = (classValue: string) => {
    return raidSetup.filter((value) => value === classValue).length
  }

  // Function to analyze the raid composition
  const analyzeRaidComposition = async (setupToAnalyze = raidSetup) => {
    setIsLoading(true)
    setError(null)

    try {
      // Filter out null values and get the class values
      const composition = setupToAnalyze.filter(Boolean) as string[]

      const response = await fetch("/api/python", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ composition }),
      })

      if (!response.ok) {
        throw new Error("Failed to analyze raid composition")
      }
      const data = await response.json()
      setBuffData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto py-4 px-3">
        <div className="bg-slate-800 border border-amber-500/20 rounded-lg overflow-hidden">
          <div className="border-b border-amber-500/20 p-3 flex justify-between items-start">
            <div>
              <h1 className="text-amber-400 text-xl font-bold">Mists of Pandaria Raid Setup Calculator</h1>
              <p className="text-slate-300 text-sm">Drag and drop classes to build your 10-player raid</p>
            </div>
            <a
              href="https://github.com/SimonManour/mop-raid-composer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 mr-1"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                <path d="M9 18c-4.51 2-5-2-7-2"></path>
              </svg>
              GitHub
            </a>
          </div>
          <div className="p-3">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Left Column - Class Selection */}
              <div className="w-full md:w-1/2">
                {/* Class Palette */}
                <div className="mb-4">
                  <h3 className="text-base font-medium text-amber-400 mb-2">Available Classes</h3>
                  <div className="p-2 bg-slate-700 rounded-md" onDragOver={handleDragOver} onDrop={handleRemoveDrop}>
                    <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {Object.entries(groupedClasses).map(([groupName, classValues]) => (
                        <div key={groupName} className="mb-2">
                          <div className="text-xs font-bold text-amber-400 mb-1">{groupName}</div>
                          <div className="space-y-1">
                            {classValues.map((classValue) => {
                              const classDetail = getClassDetails(classValue)
                              const count = getClassCount(classValue)

                              return (
                                <div
                                  key={classValue}
                                  className="flex items-center p-1 rounded-md bg-slate-600 cursor-grab"
                                  draggable={true}
                                  onDragStart={(e) => handleDragStart(e, classValue)}
                                  style={{ borderLeft: `3px solid ${classDetail.color}` }}
                                >
                                  <div className="w-5 h-5 relative mr-1">
                                    <Image
                                      src={classDetail.icon || "/placeholder.svg"}
                                      alt={classDetail.spec}
                                      fill
                                      className="object-contain"
                                    />
                                  </div>
                                  <span className="text-xs truncate max-w-[70px]">{classDetail.spec}</span>
                                  {count > 0 && (
                                    <span className="ml-auto text-xs text-amber-400 font-bold">{count}</span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Raid Slots */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-base font-medium text-amber-400">Raid Composition (10 Players)</h3>
                    {shareUrl && (
                      <button
                        onClick={copyShareUrl}
                        className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded-md flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        Share
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                    {raidSetup.map((classValue, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded-md flex flex-col items-center justify-center h-20 ${
                          classValue
                            ? "bg-slate-700 cursor-grab"
                            : "bg-slate-700/50 border border-dashed border-slate-600"
                        }`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        draggable={!!classValue}
                        onDragStart={(e) => classValue && handleRaidSlotDragStart(e, classValue, index)}
                        style={classValue ? { borderLeft: `3px solid ${getClassDetails(classValue).color}` } : {}}
                      >
                        {classValue ? (
                          <>
                            <div className="w-8 h-8 relative mb-1">
                              <Image
                                src={getClassDetails(classValue).icon || "/placeholder.svg"}
                                alt={getClassDetails(classValue).spec}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-xs text-center truncate max-w-[90px]">
                              {getClassDetails(classValue).spec}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-slate-500">Slot {index + 1}</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => analyzeRaidComposition()}
                      disabled={isLoading || raidSetup.filter(Boolean).length === 0}
                      className="bg-amber-700 hover:bg-amber-600 disabled:bg-slate-600 disabled:opacity-50 text-white px-3 py-1 text-sm rounded-md"
                    >
                      {isLoading ? "Analyzing..." : "Analyze Buffs"}
                    </button>
                    <button
                      onClick={resetSetup}
                      className="bg-red-900 hover:bg-red-800 text-white px-3 py-1 text-sm rounded-md"
                    >
                      Reset Raid
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column - Buff Analysis */}
              <div className="w-full md:w-1/2">
                <h3 className="text-base font-medium text-amber-400 mb-2">Raid Buff Analysis</h3>
                <div className="bg-slate-700 rounded-md p-3">
                  {isLoading && (
                    <div className="flex items-center justify-center h-32">
                      <div className="text-amber-400">Analyzing raid composition...</div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-900/30 border border-red-900 p-3 rounded-md">
                      <p className="text-red-400">{error}</p>
                    </div>
                  )}

                  {!isLoading && !error && !buffData && (
                    <div className="flex flex-col items-center justify-center h-32 text-center">
                      <p className="text-slate-400 mb-2">
                        Add classes to your raid and click "Analyze Buffs" to see what buffs your composition provides.
                      </p>
                      <p className="text-slate-500 text-sm">Results will appear here.</p>
                    </div>
                  )}

                  {!isLoading && !error && buffData && (
                    <div className="space-y-2">
                      {Object.entries(buffData).map(([category, data]) => {
                        const missingRequiredBuffs: boolean = Object.keys(data).length == 0
                        return (
                          <div
                            key={category}
                            className={`rounded-md p-2 ${
                              missingRequiredBuffs ? "bg-red-900/30 border border-red-800" : "bg-slate-800"
                            }`}
                          >
                            <div className="flex">
                              <h4
                                className={`text-sm font-medium w-1/4 ${
                                  missingRequiredBuffs ? "text-red-400" : "text-amber-400"
                                }`}
                              >
                                {category}
                              </h4>
                              <div className="w-3/4">
                                {data.length === 0 ? (
                                  <p className="text-xs text-slate-400 italic">No buffs in this category</p>
                                ) : (
                                  <div className="flex flex-wrap gap-1">
                                    {Object.entries(data).map(([buff, count]) => {
                                      const isMissing = count === 0

                                      return (
                                        <span
                                          key={buff}
                                          className={`inline-flex items-center text-xs px-2 py-0.5 rounded ${
                                            isMissing
                                              ? "bg-red-900/50 text-red-300 border border-red-800"
                                              : "bg-slate-700 text-slate-300"
                                          }`}
                                        >
                                          <span
                                            className={`w-1.5 h-1.5 rounded-full mr-1 ${
                                              isMissing ? "bg-red-500" : "bg-green-500"
                                            }`}
                                          ></span>
                                          {buff.replaceAll("_", " ")}
                                          {count > 1 && (
                                            <span className="ml-1 px-1 bg-amber-700/50 rounded-sm text-amber-300 text-xs">
                                              ×{count}
                                            </span>
                                          )}
                                        </span>
                                      )
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
