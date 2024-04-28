import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "./ui/input";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { AVAILABLE_COLORS } from "@/constants";

const projectNameHasValidLength = (projectName: string) => {
    return projectName.trim().length > 2 && projectName.length < 100
}

interface Props {
    readonly title?: string;
    readonly defaultName?: string;
    readonly defaultColor?: string;
    readonly trigger: JSX.Element;
    readonly onSubmit: ({ name, color }: {readonly name: string, readonly color: string}) => void;
}

export default function ProjectDialog({onSubmit, trigger, title= 'Crear proyecto', defaultName = '', defaultColor= AVAILABLE_COLORS[0]}: Props) {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [projectName, setProjectName] = useState<string>(defaultName)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [selectedColor, setSelectedColor] = useState<string>(defaultColor)

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setErrorMessage('')

        if (!projectNameHasValidLength(projectName)) {
            setErrorMessage('El nombre debe tener entre 2 y 100 caracteres')
            return
        }

        onSubmit({
            name: projectName,
            color: selectedColor
        })

        setIsModalOpen(false)
    }

    return (
        <AlertDialog open={isModalOpen} onOpenChange={() => setIsModalOpen(!isModalOpen)}>
            <AlertDialogTrigger asChild>
                {trigger}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                </AlertDialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="flex items-center justify-between space-x-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="h-6 w-6 cursor-pointer rounded-full mt-5" style={{
                                    backgroundColor: selectedColor
                                }}></button></PopoverTrigger>
                            <PopoverContent asChild>
                                <div className="w-[200px] grid grid-cols-4 gap-4 p-4">
                                    {AVAILABLE_COLORS.map((color: string) => {
                                        return (
                                            <button key={color} onClick={() => {
                                                setSelectedColor(color)
                                            }} className={`h-6 w-6 cursor-pointer rounded-full ${color === selectedColor ? 'border border-1 border-black' : ''}`} style={{
                                                backgroundColor: color
                                            }}>
                                            </button>
                                        )
                                    })}
                                </div>
                            </PopoverContent>
                        </Popover>
                        <div className="flex-1">
                            <Label>Nombre</Label>
                            <Input value={projectName} onChange={(e) => {
                                setProjectName(e.target.value)
                            }} type="text" />
                        </div>
                    </div>
                    {errorMessage.length > 0 && (
                        <span className="text-red-500">{errorMessage}</span>
                    )}
                    <AlertDialogFooter >
                        <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
                        <Button type="submit">Guardar</Button>
                    </AlertDialogFooter>
                </form>
            </AlertDialogContent>
        </AlertDialog>
    )
}