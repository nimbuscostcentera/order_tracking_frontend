import { React, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "./profile.css";
// import photo from "../pic/profile.jpg";
import photo from "../../Asset/user.png"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import useFetchAuth from "../../store/useFetchAuth";
import usePassReset from "../../store/useResetPass";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
    const [showPassword, setShowPassword] = useState(false);

    const {passResetSuccess,ispassResetLoading,passResetError,passResetFunc,ClearStatepassReset}=usePassReset()

   const {user}=useFetchAuth()
    const [resetPassData,setResetPassData]=useState({
      oldpass:"",
      confirmpass:"",
      newpass:""
    })

    const handleChange=(e)=>{
      setResetPassData({...resetPassData,[e.target.name]:e.target.value})
    }
   
    const handleSubmit=(e)=>{
      e.preventDefault()
      // console.log(resetPassData)
      let data={
        PhoneNo:user?.PhoneNumber,
        password:resetPassData?.oldpass,
        Newpassword:resetPassData?.newpass,
        ConfirmPass:resetPassData?.confirmpass
      }
      // if(data?.password != data?.NewPass){
      //   toast.error("confirm password not matching with new password", {
      //     position: "top-right",
      //     autoClose: 3000,
      //   });
      // }else{
      //   passResetFunc(data)
      // }
      passResetFunc(data)
    }

    useEffect(() => {
        if (ispassResetLoading) {
          toast.play("pleaes wait...", {
            position: "top-right",
            autoClose: 3000,
          });
        }
        if (passResetSuccess) {
          toast.success("password  reset Successfully", {
            position: "top-right",
            autoClose: 3000,
          });
          setResetPassData({
            oldpass:"",
            confirmpass:"",
            newpass:""
          })
        }
        if (
          passResetError &&
          !ispassResetLoading &&
          !passResetSuccess
        ) {
          toast.error(passResetError, {
            position: "top-right",
            autoClose: 3000,
          });
        }
        ClearStatepassReset();
      }, [ispassResetLoading, passResetSuccess, passResetError]);
    
  return (
    <Container fluid  >
      <ToastContainer/>
      <Row
        className="d-flex justify-content-center allign-item-center p-5"
        style={{ height: "100vh",width:"100vw" }}
      >
     
        <Col
          xl={4}
          lg={4}
          md={6}
          sm={6}
          xs={12}
          className="text-center border  p-3"
          style={{
            border: "10px thick",
            backgroundColor: "whitesmoke"
          }}
        >
          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <img className="img-fluid  p-3" src={photo} alt="User Profile" style={{width:"200px",height:"200px"}} />
            {/* <i class="bi bi-person-plus-fill" style={{fontSize:"100px",color:"blue"}}></i> */}
          </Col>

          <Col xl={12} lg={12} md={12} sm={12} xs={12}>
            <h3 className="mt-3">User</h3>
          </Col>

          <Row className="border mx-3">
           
            <Col
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex align-items-center justify-content-between  py-2"
            >
              <div style={{ marginleft: "50px" }}>
                <i
                  className="bi bi-person-circle"
                  style={{ color: "blue" }}
                ></i>
              </div>
              <div style={{ marginright: "50px" }}>
                {user?.Name}
              </div>
            </Col>
            <Col
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex align-items-center justify-content-between py-2"
            >
              <div style={{ width: "fit-content"}}>
                <i className="bi bi-telephone" style={{ color: "green" }}></i>
              </div>

              <div
                className="d-flex align-items-center  "
                
              >
                {user?.PhoneNumber}
                {/* { <p className="text-end">9999999999</p> } */}
              </div>
            </Col>

        
            {/* <Col
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex align-items-center justify-content-between py-2"
            >
              <div>
                <i className="bi bi-envelope" style={{ color: "#1976d2" }}></i>
              </div>
              <div style={{ marginright: "50px" }}>
                dh97@gmail.com
              </div>
            </Col> */}

            {/* <Col
              xl={12}
              lg={12}
              md={12}
              sm={12}
              xs={12}
              className="d-flex align-items-center justify-content-between py-2"
            >
              <div style={{ marginleft: "50px" }}>
                <i
                  className="bi bi-geo-alt-fill"
                  style={{ color: "#d32f2f" }}
                ></i>
              </div>

              <div style={{ marginright: "50px" }}>
                
                  37/1 Jayashree Park
                
              </div>
            </Col> */}
          </Row>
        </Col>

      

        {/* <ul className="list-unstyled mt-3 ">
              <li
                className="d-flex justify-content-center"
                style={{ gap: "350px" }}
              >
                <i className="bi bi-person-circle text-primary me-2"></i>
                SuperUser
              </li>
              <li
                className="d-flex  justify-content-center"
                style={{ gap: "330px" }}
              >
                <i className="bi bi-telephone text-success me-2"></i>
                9999999999
              </li>
              <li
                className="d-flex align-items-center justify-content-center"
                style={{ gap: "300px" }}
              >
                <i className="bi bi-envelope text-info me-2"></i>
                dh97@gmail.com
              </li>
              <li
                className="d-flex align-items-center justify-content-center"
                style={{ gap: "290px" }}
              >
                <i className="bi bi-geo-alt-fill text-danger me-2"></i> 37/1
                Jayashree Park
              </li>
            </ul> */}
        <Col
          className="text-center border  p-5"
          style={{ backgroundColor: "whitesmoke" }}
          xl={8}
          lg={8}
          md={6}
          sm={6}
          xs={12}
        >
          <h4 className="d-flex align-items-center mt-4">
            <i className="bi bi-file-lock2 text-purple me-2"></i> Change Your
            Password
          </h4>
          <Form>
            <Row className="gy-3">
              <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter old password"
                  name="oldpass"
                  onChange={handleChange}
                  value={resetPassData?.oldpass}
                />
              </Col>
              <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  onChange={handleChange}
                  name="newpass"
                  value={resetPassData?.newpass}
                />
                <Form.Text className="text-muted">
                  Must include uppercase, lowercase, number, and special
                  character.
                </Form.Text>
              </Col>
              <Col xl={6} lg={6} md={6} sm={12} xs={12}>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  name="confirmpass"
                  onChange={handleChange}
                  value={resetPassData?.confirmpass}
                />
                <Form.Text className="text-muted">
                  Must include uppercase, lowercase, number, and special
                  character.
                </Form.Text>
              </Col>
              <Col
                xs={12}
                xl={6}
                lg={6}
                md={6}
                sm={12}
                className="d-flex align-items-center"
              >
                <Form.Check
                  type="checkbox"
                  label="Show Password"
                  onChange={() => setShowPassword(!showPassword)}
                />
              </Col>
              <Col xs={12} className="text-center">
                <Button
                  variant="primary"
                  type="submit"
                  className="mt-3 w-20"
                  style={{ backgroundColor: "blue", color: "yellow" }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Col>
            </Row>
          </Form>
          <h4 className="d-flex align-items-center mt-5">
            <i className="bi bi-file-person text-info me-2"></i> More Details
          </h4>
          <Form>
            <Row className="gy-3">
              <Col md={6} xs={12} sm={12} lg={6} xl={6}>
                <Form.Control type="text" placeholder="Phone Number"  value={user?.PhoneNumber}/>
              </Col>
              <Col md={6} xs={12} sm={12} lg={6} xl={6}>
                <Form.Control type="text" placeholder="Name" value={user?.Name} />
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;