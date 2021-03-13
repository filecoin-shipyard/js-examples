import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import Dropzone from "react-dropzone";
import NavBar from "../../components/NavBar";
import { registerMeme } from "../../redux/actions/hub";

function CreateMeme(props) {
  const { bucket, registerMeme } = props;
  const history = useHistory();

  const [files, setFiles] = useState(null);

  if (!bucket) {
    history.push("/login");
  }

  return (
    <Fragment>
      <NavBar />
      <h1>Create a Meme</h1>
      <br />
      <br />
      <form style={{ marginLeft: "100px", marginRight: "100px" }}>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="name">Meme Name</label>
            <input
              type="name"
              className="form-control"
              id="name"
              placeholder="HackFS meme"
              required
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="price">Meme Price</label>
            <input
              type="text"
              className="form-control"
              id="price"
              placeholder="1 ETH"
              required
            />
          </div>
        </div>
      </form>
      <br />
      <br />
      <Dropzone
        onDrop={(acceptedFiles) => {
          setFiles(acceptedFiles[0]);
          document.getElementById(
            "dropArea"
          ).innerHTML = `${acceptedFiles[0].name} ready for upload`;
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p
                id="dropArea"
                style={{
                  marginLeft: "48px",
                  marginRight: "48px",
                  height: "100px",
                  border: "2px solid grey",
                  borderRadius: "8px",
                  padding: "24px",
                  verticalAlign: "middle",
                  display: "table-cell",
                  width: "60%",
                }}
              >
                Drag 'n' drop some files here, or click to select files
              </p>
            </div>
          </section>
        )}
      </Dropzone>
      <br />
      <br />
      <button
        id="registerMeme"
        className="btn btn-primary mb-2"
        onClick={() => {
          const file = files;
          const name = document.getElementById("name").value;
          const price = document.getElementById("price").value;
          var arrayBuffer, uint8Array;
          var fileReader = new FileReader();
          fileReader.onload = async function () {
            arrayBuffer = this.result;
            uint8Array = new Uint8Array(arrayBuffer);
            let addressArr = await window.ethereum.selectedAddress;
            registerMeme({
              address: addressArr[0],
              fileBuffer: uint8Array,
              name: name,
              price: price,
            });
            document.getElementById("registerMeme").innerText =
              "Creating Meme...";
          };
          fileReader.readAsArrayBuffer(file);
        }}
      >
        Create Meme
      </button>
      <br />
      <br />
      <div id="success" style={{ visibility: "hidden" }}>
        <h6>🎉 Congratualations! Your Meme is Registered! 🎉</h6>
        <h6>
          Head to <Link to="/marketplace">Marketplace</Link> to checkout your
          emoji
        </h6>
      </div>
    </Fragment>
  );
}

const mapStateToProps = (state) => ({
  bucket: state.app.bucket,
});

const mapDispatchToProps = (dispatch) => ({
  registerMeme: (payload) => dispatch(registerMeme(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateMeme);
