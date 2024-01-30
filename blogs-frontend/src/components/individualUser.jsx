import UserContext from "../userContext";
import { useContext } from "react";
import { useParams } from "react-router-dom";
const IndividualUser = ({ handleLogout, blogs }) => {
  const [user, UserDispatch] = useContext(UserContext);
  // console.log("logging user in usersview: ", user);
  // console.log("logging blogs in usersview: ", blogs);
  const id = useParams().id;
  const userBlogs = blogs.filter((blog) => blog.user.id === id);
  console.log("test", userBlogs);

  if (userBlogs.length === 0) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{`${user.username} logged in`}</p>
      <button onClick={() => handleLogout()}>logout</button>
      <h1>{userBlogs[0].user.username}</h1>
      <h3>added blogs</h3>
      <ul>
        {userBlogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default IndividualUser;
