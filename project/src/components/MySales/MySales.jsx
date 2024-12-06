import React, { useState, useEffect }  from 'react'
import { useNavigate } from 'react-router-dom'
import web3 from '../../ethereum/web3'
import allPurchasesContract from '../../ethereum/allPurchases'
import PurchaseContract from '../../ethereum/purchase'
import { Button, Typography, Paper, InputBase, IconButton } from '@mui/material'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SearchIcon from '@mui/icons-material/Search';
import MyOneSale from './MyOneSale'

// All my sales -> MyOneSale
function MySales() {

  // Donation adresses - initialy empty array
  const [purchasesAddresses, setPurchasesAddresses] = useState([])
  const [purchases, setPurchases] = useState([])
  const [typedTitle, setTypedTitle] = useState("")
  const [foundItems, setFoundItems] = useState([])

  const navigate = useNavigate()

  // Use Effect - fetching my sales
  useEffect(() => {
    console.log("Component MySales -> mounted...")

    const fetchMyPurchases = async () => {
      const allPurchasesInstance = allPurchasesContract()
      const accounts = await web3.eth.getAccounts()
      const allPurchasesAddresses = await allPurchasesInstance.methods.getPurchases().call({from: accounts[0]});

      // Setting the adresses to fetched array
      setPurchasesAddresses(allPurchasesAddresses)

      // All purchases
      let all = []
      let allPurchases = await Promise.all(

        Array(allPurchasesAddresses.length).fill().map( async (element, i) => {
          const purchaseInstance = PurchaseContract(allPurchasesAddresses[i]);

          let purchase = {
            address: allPurchasesAddresses[i]
          }

          // Only need to show the sales that I'm the seller in
          purchase["seller"] = await purchaseInstance.methods.seller().call()
          if(purchase.seller == accounts[0])
          {
              await Promise.all(
              purchase["title"] = await purchaseInstance.methods.title().call(),
              purchase["description"] = await purchaseInstance.methods.description().call(),
              purchase["picture"] = await purchaseInstance.methods.picture().call(),
              purchase["value"] = await purchaseInstance.methods.value().call(),
              purchase["state"] = await purchaseInstance.methods.state().call(),
              purchase["buyer"] = await purchaseInstance.methods.buyer().call(),
              purchase["successfull"] = await purchaseInstance.methods.successfull().call(),
              )
              all.push(purchase)
              return purchase;
          }
        
        })
      )

      setPurchases(all)
      console.log("Purchases: ", purchases)

    }

    fetchMyPurchases()  

  }, []);

  // onSublit - find items by title
  const onSubmit = (e) => {
    e.preventDefault()

    let niz=[]
    purchases.forEach( purchase => {
      if(purchase.title.toLowerCase().includes(typedTitle.toLowerCase()))
        niz.push(purchase)
    })
    
    setFoundItems(niz) 
  }
  
  return (

    <div style={{ marginTop: "30px"}}>
      
    <div style={{ display: "flex", flexDirection: "column", alignItems: 'center'}}> 
      <Typography variant="h5" gutterBottom sx={{ color: "gray", marginBottom:"30px"}}>
        My sales
      </Typography>
      <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}>
        <InputBase
          sx={{ ml: 1, flex: 1}}
          placeholder="search by title"
          inputProps={{ 'aria-label': 'search google maps' }}
          onChange={(e) => {setTypedTitle(e.target.value); onSubmit(e)}}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={onSubmit}>
          <SearchIcon />
        </IconButton>
      </Paper>  
    </div>

    { (foundItems.length) > 0 ? 
      (
        <div style = {{display:"flex", flexDirection:"row", justifyContent: "space-around",flexWrap: "wrap", marginTop: "50px"}}> 
          {foundItems.map( (purchase) => (
            <MyOneSale key={purchase.address} purchase={purchase}  />
       
          ))}
        </div>
      ): (
        <div style = {{display:"flex", flexDirection:"row", justifyContent: "space-around", flexWrap: "wrap", marginTop: "50px"}}> 
          {purchases.map( (purchase) => (
            <MyOneSale key={purchase.address} purchase={purchase}  />
          ))}
        </div>
      )}

      {(foundItems.length == 0) && (purchases.length == 0) && 
          <div style={{display: "flex", justifyContent:"center" , marginTop: "100px"}}> 
            <Typography variant="h5" gutterBottom sx={{ color: "gray"}}>
              You are not selling any items yet! Put your first item up for sale <ArrowRightAltIcon/>
              <Button sx={{marginLeft: "20px"}} variant="outlined" size="medium" type='submit' onClick = {() => {navigate("/addNewPurchase")}}>
              Go
            </Button>
            </Typography> 
         </div>
      }

    </div>

  )
}
export default MySales