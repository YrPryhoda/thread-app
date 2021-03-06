export default (orm, DataTypes) => {
  const User = orm.define('user', {
    email: {
      allowNull: false,
      type: DataTypes.STRING
    },
    username: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    status: {
      allowNull: true,
      type: DataTypes.STRING
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true
    },
    passwordToken: {
      allowNull: true,
      type: DataTypes.STRING,
      unique: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return User;
};
