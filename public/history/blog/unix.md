I update this post with nifty commands so I can refer to them quickly.
###Mount Secondary Drive at Boot

instead of `mount /dev/sdX /mountpoint` you should `nano /etc/fstab` and add
```
/dev/sdb1  /mountpoint   <filesystem type>   defaults   0   0
```
where the FS type can be found by `sudo fdisk -l`

###Create boot script

```
sudo mv /path/to/autorun.sh /bin/init.d
sudo chmod +x autorun.sh
sudo update-rc.d autorun.sh defaults
```
###Create symlinks
```
ln -s /path/to/file /path/to/link
```
###Count non-folder contents of directory
```
find . -type f | wc -l 
```
###SSHFS sftp file system mounting
http://fuse.sourceforge.net/sshfs.html
```
sshfs username@domain.com:/remote/ ~/local
```
###Useful Links
http://www.webupd8.org/2014/05/install-atom-text-editor-in-ubuntu-via-ppa.html
http://epochti.me (you can cURL this)

