## %d%.how_to_install

Bu belge, MyFramework sürüm 1.0 için ilk kurulumu açıklamaktadır.

### %d%.installation_steps

MyFramework 1.0'ı yüklemek için aşağıdaki komutları çalıştırın:

1.  **Depoyu klonlayın:**
    ```bash
    git clone https://github.com/myframework/myframework-starter.git
    cd myframework-v1.0
    ```
2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install --legacy-peer-deps
    ```

### %d%.post_install

Başarılı kurulumdan sonra, temel yapılandırma için `config.js` dosyasına bakın.

### %d%.avoid_uninstalling

Bu sürüm kaldırmayı desteklememektedir.

### %d%.quick_start

MyFramework 1.0'ı çalıştırmak için şunu kullanın:

```bash
npm start
```
Bu, uygulamayı `http://localhost:3000` adresinde başlatacaktır.