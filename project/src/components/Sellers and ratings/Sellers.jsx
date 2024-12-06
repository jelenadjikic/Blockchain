import React, { useState, useEffect }  from 'react'
import allPurchasesContract from '../../ethereum/allPurchases'
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography} from '@mui/material';
import OneSeller from './OneSeller';

const columns = [
    { id: 'number', label: '#', minWidth: 170 },
    { id: 'seller', label: 'Sellers address', minWidth: 100 },
    {
      id: 'rate',
      label: 'Rate',
      minWidth: 170
    }
];

function Sellers() {

  const [sellers, setSellers] = useState([])
  const [num, setNum] = useState([])

  // Use Effect
  useEffect(() => {
    console.log("Component Sellers -> mounted...")

    const fetchSellers = async () => {
      const allPurchasesInstance = allPurchasesContract()
      const allSellersAddresses = await allPurchasesInstance.methods.getSellers().call();
      setSellers(allSellersAddresses)

      let numbers = []
      for(let i=0; i<allSellersAddresses.length;i++)
      {
        numbers.push(i)
      }
      setNum(numbers)
    
    }

    fetchSellers()

  }, []);

  // Return
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: 'center', marginTop: "30px"}}> 
      <Typography variant="h5" gutterBottom sx={{ color: "gray"}}>
        Sellers and their ratings
      </Typography>
    <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: '30px' }}>
    <TableContainer sx={{ maxHeight: 440 }}>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        
         {num.map((n) => (
            <TableBody>
                <OneSeller key={n} n={n} seller={sellers[n]} />
            </TableBody>
         ))} 
      </Table>
    </TableContainer>
   
  </Paper>
  </div>

  )
}
export default Sellers