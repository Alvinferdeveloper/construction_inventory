import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface TableSkeletonProps {
  columns: number
  rows?: number
}

export function TableSkeleton({ columns, rows = 5 }: TableSkeletonProps) {
  return (
    <Card className="overflow-hidden border border-border">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted hover:bg-muted">
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index} className="font-semibold text-foreground">
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="border-b border-border hover:bg-muted/50 transition-colors">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-8 w-24" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
