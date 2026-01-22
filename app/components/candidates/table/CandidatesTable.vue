<script setup lang="ts">
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  getSortedRowModel,
  type SortingState,
} from '@tanstack/vue-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import type { Candidate } from '@/types/candidates'
import { columns } from './columns'

interface Props {
  data: Candidate[]
  isLoading?: boolean
}

const props = defineProps<Props>()

const sorting = ref<SortingState>([])

const table = useVueTable({
  get data() {
    return props.data
  },
  columns,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => {
    sorting.value = typeof updaterOrValue === 'function'
      ? updaterOrValue(sorting.value)
      : updaterOrValue
  },
  state: {
    get sorting() {
      return sorting.value
    },
  },
})

const handleRowClick = (candidate: Candidate) => {
  navigateTo(`/candidates/${candidate.id}`)
}
</script>

<template>
  <div class="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead
            v-for="header in headerGroup.headers"
            :key="header.id"
            :class="{
              'w-12.5': header.id === 'select',
            }"
          >
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length && !isLoading">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() && 'selected'"
            class="cursor-pointer hover:bg-slate-50/80 transition-colors"
            @click="handleRowClick(row.original)"
          >
            <TableCell
              v-for="cell in row.getVisibleCells()"
              :key="cell.id"
            >
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>

        <template v-else-if="isLoading">
          <TableRow
            v-for="i in 5"
            :key="i"
          >
            <TableCell
              v-for="(column, j) in columns"
              :key="j"
            >
              <Skeleton
                class="h-5 rounded-md"
                :class="j === 0 ? 'w-35' : 'w-full'"
              />
            </TableCell>
          </TableRow>
        </template>

        <template v-else>
          <TableRow>
            <TableCell
              :colspan="columns.length"
              class="h-24 text-center"
            >
              <div class="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <p>No candidates found</p>
              </div>
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
</template>
