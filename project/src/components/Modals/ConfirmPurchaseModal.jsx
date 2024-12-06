import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import web3 from '../../ethereum/web3'
import PurchaseContract from '../../ethereum/purchase'
import {  Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Button} from '@mui/material/';

function ConfirmPurchaseModal({purchase}) {

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  
  const navigate = useNavigate()
  
  // ConfirmPurchase
  const confirm = (e) => {
    
    e.preventDefault()

    const confirmPurchase = async () => {
      try{
        const accounts = await web3.eth.getAccounts()
        const purchaseInstance = PurchaseContract(purchase.address);

        const doubleValueWei = await web3.utils.toWei(2*purchase.value, 'ether')
        await purchaseInstance.methods.confirmPurchase()
            .send({
                from: accounts[0], 
                gas: 6000000,
                value: doubleValueWei
            });    
        toast.success("You have successfully confirmed purchase!")
        navigate("/myPurchases")
      }
      catch(err){
        toast.error(err)
      }
       
    }

    confirmPurchase()
    toggle()
  }

  return (
    <div style={{marginRight: "20px"}}>
      <Button variant="contained" size="medium"  onClick = {toggle}>
        Order
      </Button>
      <Modal isOpen={modal} toggle={toggle}  >
        <ModalHeader toggle={toggle}>Confirm purchase</ModalHeader>
        <ModalBody>
         Are you sure you want to confirm this purchase? 
         If you proceed to confirm, {(purchase.value * 2).toString()} ETH (double the value of this item) will be taken from your account, because of an escrow agreement. 
         Escrow is a legal arrangement in which a third party temporarily holds money until it is confirmed that item has arrived. When you confirm item has arrived, the deposit of  
         {" " + purchase.value.toString()} ETH will be returned to your account.

        </ModalBody>
        <ModalFooter>
        <Button variant="outlined" size="medium" color="success" style={{marginRight: "10px"}}  onClick = {confirm}>
            Confirm purchase
        </Button>
        <Button variant="outlined" size="medium" color="error" onClick = {toggle}>
            Cancel
        </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ConfirmPurchaseModal;