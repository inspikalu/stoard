"use client";

import { useState, useEffect, useMemo } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown, ChevronDown, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchValidators, type Validator } from "@/lib/helpers/fetchValidators";
import { formatNumber } from "@/lib/formatNumber";
import { calculateUptime } from "@/lib/calculateUptime";
import { toast } from "sonner"; // Adjust import if needed

const columns: ColumnDef<Validator>[] = [
  {
    accessorKey: "votePubkey",
    header: "Vote Pubkey",
    cell: ({ row }) => {
      const pubkey = row.getValue("votePubkey") as string;
      const handleCopy = async () => {
        await navigator.clipboard.writeText(pubkey);
        toast("Vote Public Key copied to clipboard");
      };
      return (
        <button
          className="font-medium truncate max-w-[150px] hover:underline cursor-pointer"
          title={pubkey}
          onClick={handleCopy}
          type="button"
        >
          {pubkey.substring(0, 8)}...{pubkey.substring(pubkey.length - 4)}
        </button>
      );
    },
  },
  {
    accessorKey: "nodePubkey",
    header: "Node Pubkey",
    cell: ({ row }) => {
      const pubkey = row.getValue("nodePubkey") as string;
      const handleCopy = async () => {
        await navigator.clipboard.writeText(pubkey);
        toast("Node Pubkey copied to clipboard.");
      };
      return (
        <button
          className="font-medium truncate max-w-[150px] hover:underline cursor-pointer"
          title={pubkey}
          onClick={handleCopy}
          type="button"
        >
          {pubkey.substring(0, 8)}...{pubkey.substring(pubkey.length - 4)}
        </button>
      );
    },
  },
  {
    accessorKey: "commission",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Commission
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const commission = Number.parseFloat(row.getValue("commission"));
      return <div className="text-right">{commission}%</div>;
    },
  },
  {
    accessorKey: "activatedStake",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stake
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const stake = Number.parseFloat(row.getValue("activatedStake"));
      return (
        <div className="text-right font-medium">{formatNumber(stake)}</div>
      );
    },
  },
  {
    accessorKey: "uptime",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Uptime
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const uptime = Number.parseFloat(row.getValue("uptime"));
      return (
        <div className="text-right">
          <Badge
            variant={
              uptime > 95 ? "default" : uptime > 90 ? "outline" : "destructive"
            }
          >
            {uptime.toFixed(2)}%
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => <div>{row.getValue("country")}</div>,
  },
];

export default function ValidatorTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  // Filter states
  const [countryFilter, setCountryFilter] = useState("");
  const [commissionRange, setCommissionRange] = useState([0, 100]);
  const [stakeRange, setStakeRange] = useState([0, 100]);
  const [uniqueCountries, setUniqueCountries] = useState<string[]>([]);
  const [minStake, setMinStake] = useState(0);
  const [maxStake, setMaxStake] = useState(100000000000000);
  const [isCountriesLoading, setIsCountriesLoading] = useState(false);

  // Fetch validators using TanStack Query
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["validators"],
    queryFn: async () => {
      const validators = await fetchValidators();
      return validators.map((validator) => ({
        ...validator,
        uptime: calculateUptime(validator.epochCredits),
      }));
    },
    // Add these caching options
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
    refetchOnWindowFocus: false, // Disable automatic refetching when window regains focus
    refetchOnMount: false, // Disable automatic refetching on component mount
  });
  

  // Set up unique countries and stake range when data loads
  useEffect(() => {
    if (!data) return;
    
    setIsCountriesLoading(true);
    try {
      const countries = [...new Set(data.map((v) => v.country))];
      setUniqueCountries(countries);

      const stakes = data.map((v) => v.activatedStake);
      const min = Math.min(...stakes);
      const max = Math.max(...stakes);
      setMinStake(min);
      setMaxStake(max);

      setStakeRange([0, 100]);
    } finally {
      setIsCountriesLoading(false);
    }
  }, [data]);

  // Apply filters manually
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((validator) => {
      // Country filter
      if (countryFilter && validator.country !== countryFilter) {
        return false;
      }
      // Commission filter
      if (
        validator.commission < commissionRange[0] ||
        validator.commission > commissionRange[1]
      ) {
        return false;
      }
      // Stake filter - convert to percentage for slider
      const stakePercentage =
        ((validator.activatedStake - minStake) / (maxStake - minStake)) * 100;
      if (stakePercentage < stakeRange[0] || stakePercentage > stakeRange[1]) {
        return false;
      }
      return true;
    });
  }, [data, countryFilter, commissionRange, stakeRange, minStake, maxStake]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

 const SkeletonRows = () => (
  <>
    {[...Array(10)].map((_, i) => (
      <TableRow key={i}>
        {columns.map((_, j) => (
          <TableCell key={j}>
            <Skeleton className="h-4 w-full" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="table" className="w-full">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
        </TabsList>
        <TabsContent value="filters">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="country-filter">Country Filter</Label>
                  <select
                    id="country-filter"
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>
                    Commission Range: {commissionRange[0]}% - {commissionRange[1]}%
                  </Label>
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={1}
                    value={commissionRange}
                    onValueChange={setCommissionRange}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Stake Range: {stakeRange[0]}% - {stakeRange[1]}%
                  </Label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={stakeRange}
                    onValueChange={setStakeRange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="table" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input
              placeholder="Filter by pubkey..."
              value={
                (table.getColumn("votePubkey")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("votePubkey")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <SkeletonRows />
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredRowModel().rows.length} validator(s) found.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
