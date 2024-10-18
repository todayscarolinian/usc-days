import { scheduleColumns } from "@/components/DataTables/schedules/columns"
import { DataTable } from "@/components/DataTables/schedules/schedules-table"

// Currently static data. To be Fetched from the db using the api
import { mockSchedulesData } from "@/constants/mockData"

export default function Schedules() {
  return (
    <div className="p-4 sm:py-10">
      <div className="mx-auto sm:max-w-[90rem]">
        <DataTable columns={scheduleColumns} data={mockSchedulesData} />
      </div>
    </div>
  )
}
