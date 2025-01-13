import { useState, useEffect } from "react"

export interface Transaction {
    id: number
    date: number
    description: string
    amount: number
}

const serverData = [{
    id: 1,
    date: 1736787357696,
    description: 'Transaction 1',
    amount: 5
}, {
    id: 2,
    date: 1736701004540,
    description: 'Transaction 2',
    amount: 15.5
}, {
    id: 3,
    date: 1736441824983,
    description: 'Transaction 3',
    amount: -5
}]

export const useTransactions = (startDateFilter: string | null, endDateFilter: string | null, sortColumn: keyof Transaction, sortDirection: 'asc' | 'desc' = 'asc') => {
    const [data, setData] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    const fetchData = async () => {
        setLoading(true)
        try {
            const response: Transaction[] = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    // uncomment this line to trigger the error
                    // reject('Error loading data')
                    const startFilterDate = startDateFilter ? new Date(startDateFilter) : null
                    startFilterDate?.setHours(0, 0, 0, 0)
                    const endFilterDate = endDateFilter ? new Date(endDateFilter) : null
                    endFilterDate?.setHours(23, 59, 59, 999)
                    const finalData = serverData.filter(d => {
                        const dataDate = new Date(d.date).getTime();
                        
                        const isAfterStart = startFilterDate ? dataDate >= startFilterDate.getTime() : true;
                        const isBeforeEnd = endFilterDate ? dataDate <= endFilterDate.getTime() : true;
                      
                        return isAfterStart && isBeforeEnd;
                      });
                    resolve(finalData)
                }, 500)
            })

            const sortedData = [...response].sort((a, b) => {
                const valueA = a[sortColumn];
                const valueB = b[sortColumn];
      
                if (typeof valueA === "number" && typeof valueB === "number") {
                  return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
                }
      
                if (typeof valueA === "string" && typeof valueB === "string") {
                  return sortDirection === "asc"
                    ? valueA.localeCompare(valueB)
                    : valueB.localeCompare(valueA);
                }
      
                return 0; // Fallback for unsupported types
              });

            setData(sortedData)
        } catch(e) {
            setError(typeof e === 'string' ? e : 'Unexpected error');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [startDateFilter, endDateFilter, sortColumn, sortDirection])

    return {
        loading,
        data,
        error
    }
}