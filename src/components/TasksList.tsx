import { formatSecondsToTime } from "@/lib/utils"
import { Task } from "@/types"
import moment from "moment"
import { Button } from "./ui/button"
import { Ellipsis } from "lucide-react"

interface Props {
    readonly tasks: Task[]
}


export default function TasksList({ tasks }: Props) {
    return (
        <>
            {tasks.map((task: Task) => {
                return (
                    <div key={task.id} className="p-4 bg-slate-50 rounded-md shadow-md my-3">
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-semibold mb-3">{moment(task.date, 'YYYY-MM-DD').format('DD-MM-YYYY')}</p>
                        <Button variant="ghost">
                            <Ellipsis className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start space-x-4">
                            <p>{task.description}</p>
                            {task.project ? (
                                <div className="flex items-center justify-start space-x-2">
                                    <div className="rounded-full h-2 w-2" style={{ backgroundColor: task.project.color }}></div>
                                    <p>{task.project.name}</p>
                                </div>
                            ) : (
                                <p>Sin proyecto</p>
                            )}
                        </div>
                        <p>{formatSecondsToTime(task.seconds)}</p>
                    </div>
                </div>
                )
            })}
        </>
    )
}