import React, { useState, useEffect }  from 'react'
import { Link } from 'react-router-dom'
import web3 from '../../ethereum/web3'
import allPurchasesContract from '../../ethereum/allPurchases'
import PurchaseContract from '../../ethereum/purchase'
import { Button, Paper, InputBase, IconButton, Icon, FormControl, InputLabel, Typography, MenuItem, Select} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search';
import ItemCard from './ItemCard'

// All active sales
function ActiveSales() {

  // Donation adresses - initialy empty array
  const [purchasesAddresses, setPurchasesAddresses] = useState([])
  const [purchases, setPurchases] = useState([])
  const [typedTitle, setTypedTitle] = useState("")
  const [foundItems, setFoundItems] = useState([])
  const [sort, setSort] = useState('');

  // Sort
  const handleChange = (event) => {
    setSort(event.target.value);

    // Low to high : sort by value ASCENDING (1 - 100)
    if(event.target.value){
      if(foundItems.length > 0) {
        const priceAscending = [...foundItems].sort((a, b) => a.value - b.value);
        setFoundItems(priceAscending)
      } 
      if(purchases.length > 0){
        const priceAscending = [...purchases].sort((a, b) => a.value - b.value);
        setPurchases(priceAscending)
        console.log(priceAscending)
      }
    }
    // High to low - sort by value DESCENDING (100-1)
    else {
      if(foundItems.length > 0) {
        const priceDescending = [...foundItems].sort((a, b) => b.value - a.value);
        setFoundItems(priceDescending)
      } 
      if(purchases.length >0){
        const priceDescending = [...purchases].sort((a, b) => b.value - a.value);
        setPurchases(priceDescending)
        console.log(priceDescending);
      }
    } 
  }

  // Use Effect - loading all active sales
  useEffect(() => {
    console.log("Component ActiveSales -> mounted...")

    const fetchActiveSales= async () => {
      
      console.log("Component ActiveSales -> fetching active sales...")
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

          purchase["state"] = await purchaseInstance.methods.state().call()
          let val = await purchaseInstance.methods.value().call()
          purchase["value"] = await web3.utils.fromWei(val, 'ether')
    
          if(purchase.state == 0 ){   
            await Promise.all(
              purchase["title"] = await purchaseInstance.methods.title().call(),
              purchase["description"] = await purchaseInstance.methods.description().call(),
              purchase["picture"] = await purchaseInstance.methods.picture().call(),
              purchase["seller"] = await purchaseInstance.methods.seller().call(),
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

    fetchActiveSales()  
  }, []);

  // onSublit - fount items by title
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
    <div>

      <Typography variant="h5" gutterBottom sx={{ color: "gray"}} style={{ display: "flex", flexDirection: "column", alignItems: 'center', marginTop: "30px", marginBottom: "30px"}}>
       Active sales
      </Typography>
      
      <div style={{display:"flex", flexDirection:"row", justifyContent: "space-between" ,flexWrap: "wrap"}}> 

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

        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="demo-select-small-label">price</InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={sort}
            label="Sort by price"
            onChange={handleChange}
          >
            <MenuItem value={0}>High to low</MenuItem>
            <MenuItem value={1}>Low to high</MenuItem>
          </Select>
        </FormControl>

        <Link to="/addNewPurchase">
          <Button>   
            <Icon color="primary">add_circle</Icon>     
              Add new item 
          </Button>
        </Link>
        
      </div>

      { (foundItems.length) > 0 ? 
      (
        <div style = {{display:"flex", flexDirection:"row", justifyContent: "space-around",flexWrap: "wrap", marginTop: "50px"}}> 
          {foundItems.map( (purchase) => (
            <ItemCard key={purchase.address} purchase={purchase}/>
       
          ))}
        </div>
      ) : 
      (
        <div style = {{display:"flex", flexDirection:"row", justifyContent: "space-around", flexWrap: "wrap", marginTop: "50px"}}> 
          {purchases.map( (purchase) => (
            <ItemCard key={purchase.address} purchase={purchase}/>  
          ))}
        </div>
      )}

    </div>
  )
}

export default ActiveSales