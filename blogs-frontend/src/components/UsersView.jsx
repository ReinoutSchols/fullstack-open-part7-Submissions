import Notification from "./Notification";
import UserContext from "../userContext";
import { useContext } from "react";

const UsersView = ({ handleLogout, blogs }) => {
  const [user, UserDispatch] = useContext(UserContext);
  // console.log("logging user in usersview: ", user);
  // console.log("logging blogs in usersview: ", blogs);
  const blogCounts = {};

  blogs.forEach((blog) => {
    const username = blog.user.username;
    blogCounts[username] = (blogCounts[username] || 0) + 1;
  });
  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>{`${user.username} logged in`}</p>
      <button onClick={() => handleLogout()}>logout</button>
      <h2>Users</h2>
      <div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(blogCounts).map((username) => (
              <tr key={username}>
                <td>{username}</td>
                <td>{blogCounts[username]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersView;
