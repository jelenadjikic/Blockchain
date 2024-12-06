import React from 'react'
import {ImageListItem, ImageListItemBar, ListSubheader, IconButton} from '@mui/material';
import ActiveSale from './ActiveSale';

// One active sale item card -> fullscreeen icon -> ActiveSale fullscreen dialog
function ItemCard({purchase}) {

    return (
       
      <div className = 'Item' style ={{height: "300px", width:"250px"}}>
      <ImageListItem key="Subheader" cols={2} >
        <ListSubheader component="div">{purchase.title}</ListSubheader>
      </ImageListItem>
        <ImageListItem>
          <img
            src={ `${purchase.picture}`}
            srcSet={ `${purchase.picture}`}
            alt="there is no image"
            loading="lazy"
            className='itemCardImg'
            style={{
             height: "250px",
             objectFit: "contain"
            }}
          />
          <ImageListItemBar
            title = {purchase.title}
            subtitle =  {"Price: " + purchase.value + " ETH"}
            actionIcon = {
              <IconButton sx={{ color: 'rgba(255, 255, 255, 0.54)' }}>
                <ActiveSale key={purchase.address} purchase={purchase}/>
              </IconButton>
            }
          />
        </ImageListItem>
    </div>
  )
}

export default ItemCard