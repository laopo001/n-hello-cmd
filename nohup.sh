nohup http-server . > /root/.n_nohup/http-server_..log 2>&1 &
echo 123
tail -f /root/.n_nohup/http-server_..log