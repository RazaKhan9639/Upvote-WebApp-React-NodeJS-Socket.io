import React, { useEffect } from "react";
import { MdOutlineArrowUpward } from "react-icons/md";
import { toast } from "react-toastify";
import emailjs from "@emailjs/browser";

const PhotoContainer = ({ photos, socket }) => {
  const sendEmail = (email) => {
    emailjs
      .send(
        // "service_z7c6fsb",    remove this line
        "Your_Service_ID",
        // "template_dsc4c3c",     remove this line
        "Your_Template_ID",
        {
          to_email: email,
          from_email: localStorage.getItem("_myEmail"),
        },
        // "I138c38m2l-XtCYxy"    remove this line
        "Your_Public_Key"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };
  const handleUpvote = (id) => {
    socket.emit("photoUpvote", {
      userID: localStorage.getItem("_id"),
      photoID: id,
    });
  };
  useEffect(() => {
    socket.on("upvoteSuccess", (data) => {
      toast.success(data.message);
      sendEmail(data.item[0]._ref);
    });
    socket.on("upvoteError", (data) => {
      toast.error(data.error_message);
    });
  }, [socket]);

  return (
    <main className="photoContainer">
      {photos.map((photo) => (
        <div className="photo" key={photo.id}>
          <div className="imageContainer">
            <img
              src={photo.image_url}
              alt={photo.id}
              className="photo__image"
            />
          </div>

          <button className="upvoteIcon" onClick={() => handleUpvote(photo.id)}>
            <MdOutlineArrowUpward
              style={{ fontSize: "20px", marginBottom: "5px" }}
            />
            <p style={{ fontSize: "12px", color: "#ce7777" }}>
              {photo.vote_count}
            </p>
          </button>
        </div>
      ))}
    </main>
  );
};

export default PhotoContainer;
