import { formatSecondsToTime } from "@/lib/utils"
import { Task } from "@/types"
import moment from "moment"

interface Props {
    readonly tasks: Task[]
}


export default function TasksList({tasks}: Props){
    return(
        <>
            {tasks.map((task: Task) => {
                return (
                    <div key={task.id} className="p-4 bg-slate-100 rounded-md shadow-md my-3 hover:cursor-pointer">
                        <p className="font-semibold mb-3">{moment(task.date, 'YYYY-MM-DD').format('DD-MM-YYYY')}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start space-x-4">
                                <p>{task.name}</p>
                                <div className="flex items-center justify-start space-x-2">
                                    <div className="rounded-full h-2 w-2" style={{backgroundColor: task.project.color}}></div>
                                    <p>{task.project.name}</p>
                                </div>
                            </div>
                            <p>{formatSecondsToTime(task.seconds)}</p>
                        </div>
                    </div>
                )
            })}
        </>
    )
}