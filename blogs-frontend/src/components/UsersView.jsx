import UserContext from "../userContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Table from "react-bootstrap/Table";

const UsersView = ({ handleLogout, blogs }) => {
  const [user, UserDispatch] = useContext(UserContext);
  // console.log("logging user in usersview: ", user);
  const blogCounts = {};
  const userNames = {};
  blogs.forEach((blog) => {
    const userId = blog.user.id;
    const userName = blog.user.username;
    blogCounts[userId] = (blogCounts[userId] || 0) + 1;
    userNames[userId] = userName;
  });
  console.log("logging blogCounts in usersview:", blogCounts);
  console.log("logging blogs in usersview:", blogs);
  return (
    <div>
      <h2>blogs</h2>
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Users</th>
              <th>Blogs created</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(blogCounts).map((userId) => (
              <tr key={userId}>
                <td>
                  <Link to={`/users/${userId}`}>{userNames[userId]}</Link>
                </td>
                <td>{blogCounts[userId]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default UsersView;
