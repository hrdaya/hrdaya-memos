# iptables

################################################################################
# filterテーブル設定
################################################################################
*filter
# すべてDROPとしてホワイトリスト方式でACCEPTを付与する
:INPUT DROP [0:0]
:FORWARD DROP [0:0]
:OUTPUT DROP [0:0]


# ssh接続用(VPNの設定が終わったらコメントアウトすること)
-A INPUT -i eth0 -p tcp --dport <%= @ssh_port %> -m state --state NEW -j ACCEPT

################################################################################
# 信頼できるアクセスの許可設定
################################################################################
# コネクション済のパケットは許可
-A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
-A OUTPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 自身へのアクセスは許可
-A INPUT -i lo -j ACCEPT
-A OUTPUT -o lo -j ACCEPT


################################################################################
# 内部ネットワークからの受信許可設定（eth1）
################################################################################
# ssh接続用
-A INPUT -i eth1 -p tcp --dport <%= @ssh_port %> -s <%= @eth1_network %>/24 -m state --state NEW -j ACCEPT

# ping用
-A INPUT -i eth1 -p icmp -s <%= @eth1_network %>/24 -j ACCEPT


################################################################################
# 内部ネットワークへの送信許可設定（eth1）
################################################################################
# ping用
-A OUTPUT -o eth1 -p icmp -d <%= @eth1_network %>/24 -j ACCEPT

# root宛メール送信用
-A OUTPUT -o eth1 -p tcp --dport 25 -j ACCEPT

# DNS情報取得用
-A OUTPUT -o eth1 -p udp --dport 53 -j ACCEPT

# NTPサーバからの情報取得用
-A OUTPUT -o eth1 -p udp --dport 123 -j ACCEPT

# yum用
#-A OUTPUT -o eth1 -p tcp -m multiport --dports 80,443 -j ACCEPT

# sql用
-A OUTPUT -o eth1 -p tcp --dport <%= @mysql_port %> -j ACCEPT


################################################################################
# インターネット側への送信許可設定（eth0）
################################################################################
# root宛メール送信用
-A OUTPUT -o eth0 -p tcp --dport 25 -j ACCEPT

# DNS情報取得用
-A OUTPUT -o eth0 -p udp --dport 53 -j ACCEPT

# NTPサーバからの情報取得用
-A OUTPUT -o eth0 -p udp --dport 123 -j ACCEPT

# yum用
-A OUTPUT -o eth0 -p tcp -m multiport --dports 80,443 -j ACCEPT


################################################################################
# 不要なログを残さない設定
################################################################################
#-------------------------------------------------------------------------------
# NetBIOS関連のアクセス
#-------------------------------------------------------------------------------
# すべて破棄
-A INPUT -p tcp -m multiport --dports 135,137,138,139,445 -j DROP
-A INPUT -p udp -m multiport --dports 135,137,138,139,445 -j DROP
-A FORWARD -p tcp -m multiport --dports 135,137,138,139,445 -j DROP
-A FORWARD -p udp -m multiport --dports 135,137,138,139,445 -j DROP


#-------------------------------------------------------------------------------
# DropboxのUPDパケット（port 17500）はログを記録せずに破棄
#-------------------------------------------------------------------------------
# すべて破棄
-A INPUT -p udp --dport 17500 -j DROP


#-------------------------------------------------------------------------------
# インターネットプリントのUPDパケット（port 631）はログを記録せずに破棄
#-------------------------------------------------------------------------------
# すべて破棄
-A INPUT -p udp --dport 631 -j DROP


#-------------------------------------------------------------------------------
# 攻撃対策: Smurf（ブロードキャスト、マルチキャスト）
#-------------------------------------------------------------------------------
# すべて破棄
-A INPUT -d 255.255.255.255 -j DROP
-A INPUT -d 224.0.0.1 -j DROP


################################################################################
# セキュリティに関する設定
################################################################################
#-------------------------------------------------------------------------------
# 攻撃対策: Spoofing
#-------------------------------------------------------------------------------
# 新しいチェインの作成
-N SPOOFING

# ログを残して破棄
-A SPOOFING -j LOG --log-prefix "ip_spoofing: " --log-level=notice
-A SPOOFING -j DROP

# インプットに適用
-A INPUT -s 127.0.0.0/8 -j SPOOFING
-A INPUT -s 10.0.0.0/8 -j SPOOFING
-A INPUT -s 172.16.0.0/12 -j SPOOFING
-A INPUT -s 192.168.0.0/16 -j SPOOFING

# フォワードに適用
-A FORWARD -s 127.0.0.0/8 -j SPOOFING
-A FORWARD -s 10.0.0.0/8 -j SPOOFING
-A FORWARD -s 172.16.0.0/12 -j SPOOFING
-A FORWARD -s 192.168.0.0/16 -j SPOOFING

# 自身が攻撃者とならないように設定
-A OUTPUT -d 127.0.0.0/8 -j SPOOFING
-A OUTPUT -d 10.0.0.0/8 -j SPOOFING
-A OUTPUT -d 176.16.0.0/12 -j SPOOFING
-A OUTPUT -d 192.168.0.0/16 -j SPOOFING


#-------------------------------------------------------------------------------
# 攻撃対策: ステートフル・パケットインスペクション
#-------------------------------------------------------------------------------
# ログを残す
-A INPUT -p tcp ! --syn -m state --state NEW -j LOG --log-prefix "spi_filter: " --log-level=notice


#-------------------------------------------------------------------------------
# 攻撃対策: Idle Scan
#-------------------------------------------------------------------------------
# ログを残して破棄
-A INPUT -f -j LOG --log-prefix "idle_scan: " --log-level=notice
-A INPUT -f -j DROP


#-------------------------------------------------------------------------------
# 攻撃対策: Ping of Death、Ping flood
#-------------------------------------------------------------------------------
-A INPUT -i eth0 -p icmp -j LOG --log-prefix "ping: " --log-level=notice
-A INPUT -i eth0 -p icmp -j DROP


################################################################################
# インターネット側からのアクセスの設定（eth0）
################################################################################
#-------------------------------------------------------------------------------
# HTTPクライアント用
#-------------------------------------------------------------------------------
# 新しいチェインの作成
-N HTTP_CLIENT
# 1分で60回のリクエストを受け入れ。超えた場合は1秒間に6回以上のアクセスはドロップ
-A HTTP_CLIENT -m hashlimit --hashlimit-name http_dos --hashlimit 6/s --hashlimit-burst 60 --hashlimit-mode srcip --hashlimit-htable-expire 60000 -j ACCEPT
# 制限を超えた接続をログを残して破棄
-A HTTP_CLIENT -j LOG --log-prefix "http_hashlimit: " --log-level=notice
-A HTTP_CLIENT -j DROP
# eth0のINPUTの新規接続に適用
-A INPUT -i eth0 -p tcp --dport 80 -m state --state NEW -j HTTP_CLIENT
-A INPUT -i eth0 -p tcp --dport 443 -m state --state NEW -j HTTP_CLIENT


################################################################################
# ルールにかからなかったものの処理
################################################################################
# ログを残して破棄
-A INPUT -j LOG --log-prefix "input_drop: " --log-level=notice
-A OUTPUT -j LOG --log-prefix "output_drop: " --log-level=notice
-A FORWARD -j LOG --log-prefix "forward_drop: " --log-level=notice
# デフォルトのポリシーはDROPだが保険として記述
-A INPUT -j DROP
-A OUTPUT -j DROP
-A FORWARD -j DROP
COMMIT

# [filterテーブル設定ここまで] #################################################


# iptables.conf

:msg,contains,"ip_spoofing"     /var/log/iptables/drop.log
:msg,contains,"smurf"           /var/log/iptables/drop.log
:msg,contains,"spi_filter"      /var/log/iptables/drop.log
:msg,contains,"idle_scan"       /var/log/iptables/drop.log
:msg,contains,"ping"            /var/log/iptables/drop.log
:msg,contains,"ssh_hashlimit"   /var/log/iptables/drop.log
:msg,contains,"http_hashlimit"  /var/log/iptables/drop.log
:msg,contains,"input_drop"      /var/log/iptables/drop.log
:msg,contains,"output_drop"     /var/log/iptables/drop.log
:msg,contains,"forward_drop"    /var/log/iptables/drop.log
:msg,contains,"yum"             /var/log/iptables/yum.log
