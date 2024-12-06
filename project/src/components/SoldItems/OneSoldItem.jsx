import React, { useState, useEffect }  from 'react'
import web3 from '../../ethereum/web3'
import {Card, CardActions, CardContent, CardMedia, Divider, Typography} from'@mui/material';


function OneSoldItem({purchase}) {

  const [valueInEther, setValueInEther] = useState(0)
    
  // Use Effect
  useEffect(() => {

    const convertValueToEther = async () => {
        let valEther = await web3.utils.fromWei(purchase.value, 'ether')
        setValueInEther(valEther)
    }
    convertValueToEther()
  }, []);

    return (
        <Card key= {purchase.address}  sx={{ marginTop: 5 }}>
        <CardContent style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly"}}>
            <div style={{ width: "60%" }}>
              <Typography variant="h5" component="div">
              {purchase.title}
              </Typography>
              <Divider style={{marginTop: "15px", marginBottom: "15px"}}></Divider>
              <Typography variant="body2">
              Seller: {purchase.seller}
              </Typography>
              <Typography variant="body2">
              Buyer: {purchase.buyer}
              </Typography>
              <Typography variant="body2">
              Sold for: {valueInEther.toString()} ETH
              </Typography>
            </div>
            <CardMedia
                component="img"
                src = { `${purchase.picture}`}
                alt="no image"
                className='itemCardImg'
                style ={{
                  width: "200px",
                  height: "200px",
                  borderRadius: "5px",
                  padding: "5px",
                  border: "gray solid 1px",
                  objectFit: "contain"
                }}  
            />
        </CardContent>
        <CardActions>
           
        </CardActions>
        </Card>     
  )
}

export default OneSoldItem