export default (orm, DataTypes) => {
  const PostReaction = orm.define('postReaction', {
    isLike: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isDislike: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});

  return PostReaction;
};
