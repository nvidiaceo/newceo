import bcrypt from 'bcrypt';

import jwt from 'jsonwebtoken';

import { Request, Response } from 'express';

import Users from '../../mongo/models/users';

import Products from '../../mongo/models/products';

const expiresIn = 60 * 10;

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user) {
      //
      const isOk = await bcrypt.compare(password, user.password);
      if (isOk) {
        const token = jwt.sign(
          { userId: user.id, role: user.role },
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          process.env.JWT_SECRET!,
          { expiresIn }
        );
        res.send({
          status: 'OK',
          data: {
            token,
            expiresIn
          }
        });
      } else {
        res.status(403).send({ status: 'INVALID_PASSWORD', message: '' });
      }
    } else {
      res.status(401).send({ status: 'USER_NOT_FOUND', message: '' });
    }
  } catch (e) {
    res.status(500).send({ status: 'ERROR', message: e.message });
  }
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, data } = req.body;

    const hash = await bcrypt.hash(password, 15);

    // await Users.create({
    //   username, //username:username
    //   email,
    //   data,
    //   password: hash
    // })

    const user = new Users();
    user.username = username;
    user.email = email;
    user.password = hash;
    user.data = data;

    await user.save();

    res.send({ status: 'OK', message: 'user created' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(400)
        .send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
      return;
    }
    // console.log('error createuser', error);
    res.status(500).send({ status: 'ERROR', message: error.message });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new Error('missing param userId');
    }

    await Users.findByIdAndDelete(userId);
    await Products.deleteMany({ user: userId });

    res.send({ status: 'OK', message: 'user deleted' });
  } catch (e) {
    res.status(500).send({ status: 'ERROR', message: e.message });
  }
};

const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await Users.find().select({ password: 0, __v: 0, role: 0 });
    res.send({ status: 'OK', data: users });
  } catch (e) {
    res.status(500).send({ status: 'ERROR', message: e.message });
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // eslint-disable-next-line no-console
    console.log('req.sessionData', req.sessionData.userId);
    const { username, email, data } = req.body;
    await Users.findByIdAndUpdate(req.sessionData.userId, {
      username,
      email,
      data
    });
    res.send({ status: 'OK', message: 'user updated' });
  } catch (error) {
    if (error.code && error.code === 11000) {
      res
        .status(400)
        .send({ status: 'DUPLICATED_VALUES', message: error.keyValue });
      return;
    }
    res.status(500).send({ status: 'ERROR', message: 'user updated' });
  }
};

export default {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  login
};
