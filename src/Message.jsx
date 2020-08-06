import React, { forwardRef } from "react";
import { Card, CardContent, Typography, CardMedia } from "@material-ui/core";
import "./Mesaage.css";
const Message = forwardRef((props, ref) => {
  const isUser = props.username === props.text.Username;
  return (
    <div ref={ref} className={`message ${isUser && "message__user"}`}>
      <Card className={isUser ? "message__usercard" : "message__guestcard"}>
        <CardMedia
          component="img"
          alt=""
          width="33%"
          height="auto"
          image={props.text.imageUrl}
        />
        <CardContent>
          <Typography color="white" varient="h5" component="h2">
            {!isUser && `${props.text.Username || "Unknown User"}: `}
            {props.text.message}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
});

export default Message;
