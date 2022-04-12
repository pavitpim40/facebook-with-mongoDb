const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const res = require("express/lib/response");

router.get("/", (req, res) => {
	res.send("hey its user route");
});

// update user
router.put("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		// update password if user send new password
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (error) {
				return res.status(500).json(error);
			}
		}

		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			res.status(200).json("Account has been updated");
		} catch (error) {
			return res.status(500).json(error);
		}
	} else {
		res.status(403).json("You can update only your account");
	}
});

// delete user
router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			const user = await User.findByIdAndDelete(req.params.id);
			res.status(200).json("Account has been deleted");
		} catch (error) {
			return res.status(500).json(error);
		}
	} else {
		res.status(403).json("You can delete only your account");
	}
});
module.exports = router;
