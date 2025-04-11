"use client"

import type React from "react"
import {useState} from "react"
import Image from "next/image"

// Class definitions with their specs - updated to ensure all have specializations
const classOptions = [
    {value: "dk_blood", spec: "Blood", icon: "/icons/deathknight/blood.png?height=20&width=20", color: "#C41E3A"},
    {value: "dk_unholy", spec: "Unholy", icon: "/icons/deathknight/frost.png?height=20&width=20", color: "#C41E3A"},
    {value: "dk_frost", spec: "Frost", icon: "/icons/deathknight/unholy.png?height=20&width=20", color: "#C41E3A",},
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
    {value: "hunter_bm", spec: "Beastmaster", icon: "/icons/hunter/beastmastery.png?height=20&width=20", color: "#ABD473",},
    {
        value: "warrior_prot",
        spec: "Protection",
        icon: "/icons/warrior/protection.png?height=20&width=20",
        color: "#C79C6E",
    },
    {value: "warrior_arms", spec: "Arms", icon: "/icons/warrior/arms.png?height=20&width=20", color: "#C79C6E",},
    {value: "warrior_fury", spec: "Fury", icon: "/icons/warrior/fury.png?height=20&width=20", color: "#C79C6E",},
    {
        value: "rogue_assa",
        spec: "Assassin",
        icon: "/icons/rogue/assassination.png?height=20&width=20",
        color: "#FFF569",
    },
    {value: "rogue_sub", spec: "Subtlety", icon: "/icons/rogue/subtlety.png?height=20&width=20", color: "#FFF569",},
    {value: "rogue_combat", spec: "Combat", icon: "/icons/rogue/combat.png?height=20&width=20", color: "#FFF569",},
    {
        value: "shaman_resto",
        spec: "Restoration",
        icon: "/icons/shaman/restoration.png?height=20&width=20",
        color: "#0070DE",
    },
    {value: "shaman_enha", spec: "Enhancement", icon: "/icons/shaman/enhancement.png?height=20&width=20", color: "#0070DE",},
    {
        value: "shaman_ele",
        spec: "Elemental",
        icon: "/icons/shaman/elemental.png?height=20&width=20",
        color: "#0070DE",
    },
    {value: "mage_arcane", spec: "Arcane", icon: "/icons/mage/arcane.png?height=20&width=20", color: "#69CCF0"},
    {value: "mage_fire", spec: "Fire", icon: "/icons/mage/fire.png?height=20&width=20", color: "#69CCF0"},
    {value: "mage_frost", spec: "Frost", icon: "/icons/mage/frost.png?height=20&width=20", color: "#69CCF0"},
    {
        value: "druid_resto",
        spec: "Restoration",
        icon: "/icons/druid/restoration.png?height=20&width=20",
        color: "#FF7D0A"
    },
    {value: "druid_feral", spec: "Feral", icon: "/icons/druid/feral.png?height=20&width=20", color: "#FF7D0A",},
    {value: "druid_bala", spec: "Balance", icon: "/icons/druid/balance.png?height=20&width=20", $color: "#FF7D0A",},
    {value: "monk_mist", spec: "Mistweaver", icon: "/icons/monk/mistweaver.png?height=20&width=20", color: "#00FF96"},
    {value: "monk_brew", spec: "Brewmaster", icon: "/icons/monk/brewmaster.png?height=20&width=20", color: "#00FF96"},
    {value: "monk_ww", spec: "Windwalker", icon: "/icons/monk/windwalker.png?height=20&width=20", color: "#00FF96"},
    {value: "priest_holy", spec: "Holy", icon: "/icons/priest/holy.png?height=20&width=20", color: "#FFFFFF"},
    {value: "priest_sh", spec: "Shadow", icon: "/icons/priest/shadow.png?height=20&width=20", color: "#FFFFFF",},
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
    {value: "paladin_holy", spec: "Holy", icon: "/icons/paladin/holy.png?height=20&width=20", color: "#F58CBA"},
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
    "Death Knight": ['dk_blood', 'dk_unholy', 'dk_frost'],
    Hunter: ['hunter_mark', 'hunter_surv', 'hunter_bm'],
    Warrior: ['warrior_prot', 'warrior_arms', 'warrior_fury'],
    Rogue: ['rogue_assa', 'rogue_sub', 'rogue_combat'],
    Shaman: ['shaman_resto', "shaman_enha", "shaman_ele"],
    Mage: ['mage_fire', 'mage_frost', 'mage_arcane'],
    Druid: ['druid_resto', 'druid_feral', 'druid_bala'],
    Monk: ['monk_mist', 'monk_brew', 'monk_ww'],
    Priest: ['priest_holy', 'priest_sh', 'priest_disc'],
    Warlock: ['warlock_affli', 'warlock_destro', 'warlock_demo'],
    Paladin: ['paladin_holy', 'paladin_ret', 'paladin_prot'],
}

export default function RaidSetupCalculator() {
    // Initialize state with 10 empty slots
    const [raidSetup, setRaidSetup] = useState<(string | null)[]>(Array(10).fill(null))
    const [draggedClass, setDraggedClass] = useState<string | null>(null)

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

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <div className="container mx-auto py-4 px-3">
                <div className="bg-slate-800 border border-amber-500/20 rounded-lg overflow-hidden">
                    <div className="border-b border-amber-500/20 p-3">
                        <h1 className="text-amber-400 text-xl font-bold">Mists of Pandaria Raid Setup Calculator</h1>
                        <p className="text-slate-300 text-sm">Drag and drop classes to build your 10-player raid</p>
                    </div>
                    <div className="p-3">
                        {/* Class Palette */}
                        <div className="mb-4">
                            <h3 className="text-base font-medium text-amber-400 mb-2">Available Classes</h3>
                            <div className="p-2 bg-slate-700 rounded-md" onDragOver={handleDragOver}
                                 onDrop={handleRemoveDrop}>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
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
                                                            style={{borderLeft: `3px solid ${classDetail.color}`}}
                                                        >
                                                            <div className="w-5 h-5 relative mr-1">
                                                                <Image
                                                                    src={classDetail.icon || "/placeholder.svg"}
                                                                    alt={classDetail.spec}
                                                                    fill
                                                                    className="object-contain"
                                                                />
                                                            </div>
                                                            <span
                                                                className="text-xs truncate max-w-[96px]">{classDetail.spec}</span>
                                                            {count > 0 && <span
                                                                className="ml-auto text-xs text-amber-400 font-bold">{count}</span>}
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
                            <h3 className="text-base font-medium text-amber-400 mb-2">Raid Composition (10 Players)</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                {raidSetup.map((classValue, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-md flex flex-col items-center justify-center h-20 ${
                                            classValue ? "bg-slate-700 cursor-grab" : "bg-slate-700/50 border border-dashed border-slate-600"
                                        }`}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        draggable={!!classValue}
                                        onDragStart={(e) => classValue && handleRaidSlotDragStart(e, classValue, index)}
                                        style={classValue ? {borderLeft: `3px solid ${getClassDetails(classValue).color}`} : {}}
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
                            <div className="flex justify-end mt-3">
                                <button
                                    onClick={resetSetup}
                                    className="bg-red-900 hover:bg-red-800 text-white px-3 py-1 text-sm rounded-md"
                                >
                                    Reset Raid
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
