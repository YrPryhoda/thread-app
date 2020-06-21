export default (orm, DataTypes) => {
  const CommentReaction = orm.define('commentReaction', {
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

  return CommentReaction;
};
