import React from 'react';
import * as yup from "yup";
import valid from "card-validator";
import {useFormik} from "formik";
import axios from "axios";
import {useHistory} from 'react-router-dom';
import ReactPaginate from 'react-paginate';



const Purchase = () => {
  const [btnState, setBtnState] = React.useState('');
  const [accountState, setAccountState] = React.useState(JSON.parse(localStorage.getItem('credentials')).type);
  const history = useHistory();
  const validationSchema = yup.object({
    creditcard: yup.string()
      .test('test-number', // this is used internally by yup
        'Credit Card number is invalid', //validation message
        value => valid.number(value).isValid) // return true false based on validation
      .required(),
    cardname: yup.string().required('Card Name Required'),
    cvc: yup.string().max(4, 'Invalid CVC'),
  })

  React.useEffect(()=>{
    if(accountState === "Premium"){
      history.push('/home')
    }
  })

  const formik = useFormik({
    initialValues: {creditcard: "", cardname: "", expiry_month: "", expiry_year: "", cvc: ""},
    validateOnBlur: true,
    onSubmit,
    validationSchema: validationSchema,
  })
  const onSubmit = async ()=> {
    const request = async () =>{
      const header = {
        headers:{
          "Accept": "application/json"
        }
      }
      const body = {
        creditcard: formik.values.creditcard,
        cardname: formik.values.cardname,
        expiry_month: formik.values.expiry_month,
        expiry_year: formik.values.expiry_year,
        cvc: formik.values.cvc,
        id: JSON.parse(localStorage.getItem('credentials')).id
      }
      setBtnState('checkout')
      return await axios.post("http://127.0.0.1:8000/api/purchasePremium", body, header).then((response) => {

        return response
      }).catch(function (error){
        setBtnState('error')
      })


    }

    request().then(r => {
      if(r.status === 200){
        setBtnState('done')
        localStorage.setItem('credentials', JSON.stringify(r.data[0]))
      }
      console.log(r.status)
    })


  }

  const CheckoutButton = (props) => {
    switch (props.state){
      case 'checkout':
        return <div><button type="button" className="btn btn-warning btn-lg btn-block my-5"><center>Loading...</center></button></div>
      case 'done':
        return <div><button type="button" className="btn btn-success btn-lg btn-block my-5"><center>Finished!</center></button></div>
      case 'error':
        return <div><button type="button" className="btn btn-danger btn-lg btn-block my-5"><center>Error!</center></button></div>

      default:
        return <button type="button"  onClick={onSubmit} className="btn btn-success btn-lg btn-block my-5"><center>Checkout</center></button>
    }
  }

  return (
    <div>
      <div className="bs-component">
        <div className="row d-flex justify-content-center">
          <div className="card text-white bg-info my-2">
            <div className="card-header">Purchase Premium Navbar</div>
            <div className="card-body">
              <h4 className="card-title">Heads Up!</h4>
              <p className="card-text">You are about to buy a premium navbar for $9.99</p>

              <form>
                <div className="row">
                  <div className="col-md-5">
                    <div className="form-group">
                      <label className="col-form-label col-form-label-lg" htmlFor="inputLarge">Credit Card Number</label>
                      <input className="form-control form-control-lg" type="text" name="creditcard" onBlur={formik.handleBlur} value={formik.values.creditcard} onChange={formik.handleChange}/>
                    </div>
                    {formik.touched.creditcard && formik.errors.creditcard ?
                      formik.errors.creditcard
                      :
                      ""
                    }
                  </div>

                </div>
                <div className="row">
                  <div className="col-md-5">
                    <label className="col-form-label" htmlFor="inputLarge">Credit Card Name</label>
                    <div className="form-group">
                      <input className="form-control form-control-lg" onBlur={formik.handleBlur} value={formik.values.cardname} onChange={formik.handleChange} type="text" placeholder=".form-control-lg" name="cardname"/>
                    </div>
                    {formik.touched.cardname && formik.errors.cardname ?
                      formik.errors.cardname
                      :
                      ""
                    }
                  </div>

                </div>
                <div className="row">
                  <div className="col-md-4">
                    <label className="col-form-label col-form-label-lg" htmlFor="inputLarge">Expiry</label>

                    <div className="form-row">
                      <div className="col-md-4">
                        <input className="form-control" onBlur={formik.handleBlur} value={formik.values.expiry_month} onChange={formik.handleChange} type="text" name="expiry_month"/>
                        {formik.touched.expiry_month && formik.errors.expiry_month ?
                          formik.errors.expiry_month
                          :
                          ""
                        }
                      </div>
                      <div className="col-md-4">
                        <input className="form-control" onBlur={formik.handleBlur} value={formik.values.expiry_year} onChange={formik.handleChange} type="text" name="expiry_year"/>
                        {formik.touched.expiry_year && formik.errors.expiry_year ?
                          formik.errors.expiry_year
                          :
                          ""
                        }
                      </div>
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group">
                      <label className="col-form-label col-form-label-lg" htmlFor="inputLarge">CVC</label>
                      <input className="form-control form-control-lg" type="text" placeholder=".form-control-lg" onBlur={formik.handleBlur} value={formik.values.cvc} onChange={formik.handleChange}
                             name="cvc"/>
                      {formik.touched.cvc && formik.errors.cvc ?
                        formik.errors.cvc
                        :
                        ""
                      }
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md">
                    <div className="form-group">
                      <CheckoutButton state={btnState}/>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="card-footer">
             <center> <h5>Sponsored by Stripe</h5></center>
            </div>
          </div>

        </div>


      </div>
    </div>
  );
};

export default Purchase;
