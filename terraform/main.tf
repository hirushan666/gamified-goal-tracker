# ================================
# Terraform: App Server Only (Dynamic IP)
# ================================

# 1️⃣ AWS Provider
provider "aws" {
  region = "eu-north-1"
}

# 2️⃣ Dynamically find latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical official Ubuntu

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# 3️⃣ Security Group for App Server
resource "aws_security_group" "app_sg" {
  name        = "app-sg"
  description = "Allow SSH (22) and Web (80/3000)"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress { # Standard HTTP
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress { # Node.js App Port
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 4️⃣ App Server Instance (Dynamic IP)
resource "aws_instance" "app_server" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"
  key_name      = "jenkins-ec2-key" # ✅ Using your existing key

  vpc_security_group_ids = [aws_security_group.app_sg.id]

  tags = {
    Name = "App-Server"
  }
}

# 5️⃣ Outputs (Now shows Dynamic IP)
output "app_server_ip" {
  value = aws_instance.app_server.public_ip
}
