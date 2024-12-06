import React, { useState, useEffect }  from 'react'
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import allPurchasesContract from '../../ethereum/allPurchases'
import Rating from '@mui/material/Rating';

function OneSeller({n, seller}) {

  const [rate, setRate] = useState(0)
  const [numOfRatings, setNumOfRatings] = useState(0)

  // Use Effect
  useEffect(() => {
    console.log("Component OnSeller -> mounted...")

    const fetchRate = async () => {
        const allPurchasesInstance = allPurchasesContract()
        const totalRate = parseInt(await allPurchasesInstance.methods.getTotalRateForSeller(seller).call());
        const numOfRatings = parseInt(await allPurchasesInstance.methods.getNumberOfTimesRatedForSeller(seller).call());
       
        // Ocenjivan je do sada
        if(numOfRatings != 0){
            const averageRate = totalRate / numOfRatings
            setRate(averageRate)
            setNumOfRatings(numOfRatings)
            console.log(rate)
        } 
        else {
            // Nikad nije ocenjen
            setNumOfRatings(0)
        }
        
    }

    fetchRate()
  }, []);


  return (
    <TableRow hover role="checkbox" tabIndex={-1} >
            <TableCell   style={{ minWidth: "170" }}>
                {n}
            </TableCell>
            <TableCell style={{ minWidth: "170" }}>
                {seller}
            </TableCell>
            <TableCell style={{ minWidth: "170" }}>
                {numOfRatings != 0 ? 
                (
                    <Rating name="read-only" value={rate}  precision={0.5} readOnly />
                ): (
                    <div>Seller has not been rated yet!</div>
                )}
                
            </TableCell>
        </TableRow>
    
  )
}

export default OneSeller