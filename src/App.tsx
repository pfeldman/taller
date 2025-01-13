import { useState } from 'react';
import './App.css'
import { Transaction, useTransactions } from './hooks/useTransactions'
import { format } from 'date-fns';

function App() {
  const [sortBy, setSortBy] = useState<keyof Transaction>('id')
  const [startDateFilter, setStartDateFilter] = useState<string | null>(null)
  const [endDateFilter, setEndDateFilter] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState(true)
  const { data, loading, error } = useTransactions(startDateFilter, endDateFilter, sortBy, sortDirection ? 'asc' : 'desc')

  const handleStartDateChange = (date: string) => {
    setStartDateFilter(date)
  }

  const handleEndDateChange = (date: string) => {
    setEndDateFilter(date)
  }

  const resetFilter = () => {
    setStartDateFilter(null)
  }

  const sort = (column: keyof Transaction) => {
    setSortBy(column)
    setSortDirection(sortBy === column ? !sortDirection : true)
  }

  const getCharacter = (type: keyof Transaction) => {
    if (sortBy === type) {
      if (sortDirection) {
        return '▼'
      } else {
        return '▲'
      }
    }
    return ''
  }

  const total = data.reduce((acc, curr) => {
    return acc + curr.amount
  }, 0)

  return (
    <>
      {loading ? (
        <span>Loading...</span>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div>
          <div className='filters'>
            <div>
              <div>
                Start Date: <input type="date" onChange={e => handleStartDateChange(e.target.value)} value={startDateFilter ?? ''} />
              </div>
              <div>
                End Date: <input type="date" onChange={e => handleEndDateChange(e.target.value)} value={endDateFilter ?? ''} />
              </div>
            </div>
            <button onClick={resetFilter}>Clear</button>
          </div>
          <div>Total Transaction amount is: ${total.toFixed(2)}</div>
          <table className="table">
            <thead>
              <tr>
                <th onClick={() => sort('id')}>ID {getCharacter('id')}</th>
                <th onClick={() => sort('date')}>Date  {getCharacter('date')}</th>
                <th onClick={() => sort('description')}>Description  {getCharacter('description')}</th>
                <th onClick={() => sort('amount')} className="right">Amount  {getCharacter('amount')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{format(new Date(transaction.date), 'MM/dd/yyyy')}</td>
                  <td>{transaction.description}</td>
                  <td className='right'>${transaction.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

export default App
